import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";

export default function UserImage({
  user,
  className,
}: {
  user?: {
    name: string;
    profilePicture: string | null;
  } | null;
  className?: string;
}) {
  if (isEmpty(user)) return <CircleUserRound />;
  return (
    <div
      className={cn(
        "relative flex size-2xl shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-solid border-primary bg-accent text-sm leading-none font-bold text-foreground",
        className
      )}
    >
      {user?.profilePicture ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_CDNURL!}${user?.profilePicture}`}
          alt=""
          fill
          sizes="3rem"
          className="object-cover"
        />
      ) : (
        <span className="uppercase">{user?.name?.slice(0, 1)}</span>
      )}
    </div>
  );
}

export const UserImageSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn("aspect-square rounded-full", className)} />
);
