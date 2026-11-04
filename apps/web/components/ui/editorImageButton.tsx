"use client";

import {
  EDITOR_IMAGE_MAX_BYTES,
  EDITOR_IMAGE_MAX_PX,
  EDITOR_IMAGE_TYPES,
} from "@/lib/constants";
import { Editor } from "@tiptap/react";
import { upload } from "@vercel/blob/client";
import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Toggle } from "@workspace/ui/components/toggle";

async function imageSize(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      EDITOR_IMAGE_MAX_PX / bitmap.width,
      EDITOR_IMAGE_MAX_PX / bitmap.height
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    bitmap.close();
    if (!width || !height) return {};
    return { width, height };
  } catch {
    return {};
  }
}

function imageSrc(pathname: string, fallbackUrl: string) {
  const cdnUrl = process.env.NEXT_PUBLIC_CDNURL;
  if (!cdnUrl) return fallbackUrl;
  const base = cdnUrl.endsWith("/") ? cdnUrl : `${cdnUrl}/`;
  const path = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return `${base}${path}`;
}

export default function EditorImageButton({
  editor,
  onError,
}: {
  editor: Editor;
  onError: (message: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!(EDITOR_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      onError("Use a JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > EDITOR_IMAGE_MAX_BYTES) {
      onError(
        `Image must be ${EDITOR_IMAGE_MAX_BYTES / (1024 * 1024)} MB or smaller.`
      );
      return;
    }

    const extension = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf("."))
      : "";

    onError(null);
    setUploading(true);
    try {
      const blob = await upload(
        `content/${crypto.randomUUID()}${extension}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/editor/image",
        }
      );
      const size = await imageSize(file);
      editor
        .chain()
        .setImage({
          src: imageSrc(blob.pathname, blob.url),
          alt: file.name,
          ...size,
        })
        .run();
    } catch {
      onError("Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Toggle
        size="sm"
        pressed={uploading}
        disabled={uploading}
        aria-label="Upload image"
        onPressedChange={() => inputRef.current?.click()}
        className="size-xl min-w-xl shrink-0 p-0"
      >
        <ImageIcon className="size-md" />
      </Toggle>
      <input
        ref={inputRef}
        type="file"
        accept={EDITOR_IMAGE_TYPES.join(",")}
        hidden
        onChange={onChange}
      />
    </>
  );
}
