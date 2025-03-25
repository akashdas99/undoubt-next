"use client";

import { upload } from "@vercel/blob/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AvatarUploadPage() {
  const router = useRouter();
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files) {
      return;
    }

    const file = event.target.files[0];

    await upload("public/" + file.name, file, {
      access: "public",
      handleUploadUrl: "/api/user/image",
    });
    router.refresh();
    event.target.value = "";
  };
  return (
    <>
      <label
        role="button"
        htmlFor="uploadfile"
        className="absolute bottom-0 right-0 bg-primary rounded-full p-1"
      >
        <Pencil className="w-2 h-2" color="#ffffff" />
      </label>
      <input id="uploadfile" type="file" hidden onChange={handleUpload} />
    </>
  );
}
