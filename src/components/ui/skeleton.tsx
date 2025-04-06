import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-wave rounded-md bg-white/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
