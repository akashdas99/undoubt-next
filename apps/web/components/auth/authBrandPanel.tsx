import { AuthConstellation } from "@/components/auth/authConstellation";
import { cn } from "@/lib/utils";

type PillPlace =
  | "topLeft"
  | "topRight"
  | "midLeft"
  | "bottomRight"
  | "bottomLeft";
type PillTilt = "left" | "none" | "right";

type TopicPill = {
  readonly label: string;
  readonly place: PillPlace;
  readonly tilt: PillTilt;
};

const PLACE_CLASS: Record<PillPlace, string> = {
  topLeft: "top-sm left-0",
  topRight: "top-md right-0",
  midLeft: "top-1/2 left-0 -translate-y-1/2",
  bottomRight: "right-0 bottom-lg",
  bottomLeft: "bottom-sm left-0",
};

const TILT_CLASS: Record<PillTilt, string> = {
  left: "-rotate-2",
  none: "",
  right: "rotate-2",
};

const TOPIC_PILLS = [
  { label: "JavaScript", place: "topLeft", tilt: "left" },
  { label: "System design", place: "topRight", tilt: "right" },
  { label: "Calculus", place: "midLeft", tilt: "none" },
  { label: "Databases", place: "bottomRight", tilt: "right" },
  { label: "Career", place: "bottomLeft", tilt: "left" },
] as const satisfies readonly TopicPill[];

const BRAND_COPY = {
  headline: "Clear your doubts. Find your answers.",
  pitch:
    "A Q&A forum for questions, answers, and clearing doubts. Ask freely, learn together.",
} as const;

export default function AuthBrandPanel() {
  return (
    <aside
      aria-label="About Undoubt"
      className="hidden min-h-svh flex-col gap-2xl bg-primary pt-3xl text-primary-foreground lg:flex"
    >
      <div className="flex flex-col gap-md px-3xl">
        <h2 className="font-display text-display">{BRAND_COPY.headline}</h2>
        <p className="text-primary-foreground/90">{BRAND_COPY.pitch}</p>
      </div>
      <div className="min-h-0 w-full flex-1 pr-sm pl-3xl">
        <div className="relative h-full w-full">
          <AuthConstellation />
          <ul
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {TOPIC_PILLS.map((pill) => (
              <li
                key={pill.label}
                className={cn(
                  "absolute w-fit rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-sm py-xxs text-sm backdrop-blur-sm",
                  PLACE_CLASS[pill.place],
                  TILT_CLASS[pill.tilt]
                )}
              >
                {pill.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
