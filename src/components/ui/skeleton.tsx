import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-wave rounded-md bg-[#817e7e36] h-full w-full",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
