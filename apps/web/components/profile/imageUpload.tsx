"use client";

import { useInvalidateProfile } from "@/lib/queries/user";
import { upload } from "@vercel/blob/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AvatarUploadPage() {
  const router = useRouter();
  const invalidateProfile = useInvalidateProfile();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files) {
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    await upload("public/" + file.name, file, {
      access: "public",
      handleUploadUrl: "/api/user/image",
    });
    router.refresh();
    invalidateProfile();

    event.target.value = "";
  };
  return (
    <>
      <label
        role="button"
        htmlFor="uploadfile"
        className="absolute right-0 bottom-0 rounded-full bg-primary p-xxs"
      >
        <Pencil className="size-xs" color="#ffffff" />
      </label>
      <input id="uploadfile" type="file" hidden onChange={handleUpload} />
    </>
  );
}
