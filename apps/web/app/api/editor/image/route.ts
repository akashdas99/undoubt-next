import {
  EDITOR_IMAGE_MAX_BYTES,
  EDITOR_IMAGE_TYPES,
  EDITOR_IMAGE_UPLOAD_WINDOW_MS,
} from "@/lib/constants";
import { getSession } from "@/lib/session";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        let userId: string | undefined;
        try {
          userId = (await getSession())?.id;
        } catch {
          userId = undefined;
        }
        if (!userId || !pathname.startsWith("content/")) {
          throw new Error("Could not upload file");
        }

        return {
          allowedContentTypes: [...EDITOR_IMAGE_TYPES],
          tokenPayload: JSON.stringify({ userId }),
          maximumSizeInBytes: EDITOR_IMAGE_MAX_BYTES,
          validUntil: Date.now() + EDITOR_IMAGE_UPLOAD_WINDOW_MS,
        };
      },
      onUploadCompleted: async ({ tokenPayload }) => {
        const userId = tokenPayload
          ? (JSON.parse(tokenPayload) as { userId?: string }).userId
          : undefined;
        if (!userId) throw new Error("Could not upload file");
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
