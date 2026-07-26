import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@workspace/ui/components/skeleton";

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
        "relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-solid border-primary bg-accent align-middle font-bold text-foreground",
        className
      )}
    >
      {user?.profilePicture ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_CDNURL!}${user?.profilePicture}`}
          alt=""
          height={30}
          width={30}
        />
      ) : (
        user?.name?.slice(0, 1)
      )}
    </div>
  );
}

export const UserImageSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn("aspect-square rounded-full", className)} />
);
