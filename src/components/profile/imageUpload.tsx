"use client";

import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState } from "react";

export default function AvatarUploadPage() {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (!event?.target?.files) {
      throw new Error("No file selected");
    }

    const file = event.target.files[0];

    const newBlob = await upload("public/" + file.name, file, {
      access: "public",
      handleUploadUrl: "/api/user/image",
    });

    setBlob(newBlob);
  };
  return (
    <>
      <label
        role="button"
        htmlFor="uploadfile"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary hover:text-primary-foregrounds"
      >
        Upload Image
      </label>
      <input id="uploadfile" type="file" hidden onChange={handleUpload} />

      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
