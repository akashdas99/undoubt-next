import { EDITOR_IMAGE_MAX_PX, EDITOR_IMAGE_MIN_PX } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

function cdnHostname() {
  const cdnUrl = process.env.NEXT_PUBLIC_CDNURL;
  if (!cdnUrl) return "";
  try {
    return new URL(cdnUrl).hostname.toLowerCase();
  } catch {
    return cdnUrl.split("/")[0]?.toLowerCase() || "";
  }
}

const imageHost = cdnHostname();

function pixelSize(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const px = Math.min(
    EDITOR_IMAGE_MAX_PX,
    Math.max(EDITOR_IMAGE_MIN_PX, Number(value))
  );
  return String(px);
}

function isAllowedImageSrc(src: string | undefined) {
  if (!src) return false;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      imageHost !== "" &&
      url.hostname.toLowerCase() === imageHost
    );
  } catch {
    return false;
  }
}

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
    transformTags: {
      img: (tagName, attribs) => {
        const next = { ...attribs };
        const width = pixelSize(attribs.width);
        const height = pixelSize(attribs.height);
        if (width) next.width = width;
        else delete next.width;
        if (height) next.height = height;
        else delete next.height;
        return { tagName, attribs: next };
      },
    },
    allowedSchemes: sanitizeHtml.defaults.allowedSchemes,
    allowedSchemesByTag: {
      ...sanitizeHtml.defaults.allowedSchemesByTag,
      img: ["https"],
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" && !isAllowedImageSrc(frame.attribs.src),
  });
}
