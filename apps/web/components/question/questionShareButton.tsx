"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function QuestionShareButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = `${window.location.origin}/question/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={copied ? "Link copied" : `Share question: ${title}`}
      className="relative z-10 flex items-center gap-xxs font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      <span>{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
