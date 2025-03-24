import { getSessionFromToken, getSessionToken } from "@/lib/session";
import UserModel from "@/models/user";
import { copy } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file

        const session = await getSessionToken();
        if (!session || !pathname.startsWith("public/"))
          throw new Error("Could not upload file");

        return {
          allowedContentTypes: ["image/*"],
          tokenPayload: JSON.stringify({
            session,
          }),
          maximumSizeInBytes: 1024 * 1024,
          validUntil: Date.now() + 60 * 1000,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion

        if (!tokenPayload) throw new Error("Could not upload file");
        const session = await getSessionFromToken(tokenPayload);

        try {
          const user = await UserModel.findById(session?.id);
          if (!user) throw new Error("User not found");
          const userPathName =
            "user/" +
            user?._id?.toString() +
            "/" +
            uuidv4() +
            path.extname(blob?.pathname);

          console.log("pathname", userPathName);

          const copiedBlog = await copy(blob?.url, userPathName, {
            access: "public",
          });
          user.profilePicture = copiedBlog?.pathname;
          await user.save();
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
