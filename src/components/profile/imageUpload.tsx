"use client";

import { userApi } from "@/lib/store/user/user";
import { upload } from "@vercel/blob/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function AvatarUploadPage() {
  const router = useRouter();
  const dispatch = useDispatch();

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
    dispatch(userApi.util.invalidateTags(["profile"]));

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
