import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { User } from "@/models/user";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Skeleton } from "./skeleton";

export default function UserImage({
  user,
  className,
  isLoading = false,
}: {
  user?: User;
  className?: string;
  isLoading?: boolean;
}) {
  if (isLoading)
    return <Skeleton className={cn("aspect-square rounded-full", className)} />;
  if (isEmpty(user)) return <CircleUserRound />;
  return (
    <div
      className={cn(
        "w-full aspect-square shrink-0 bg-accent border-2 border-primary border-solid font-bold align-middle rounded-full flex justify-center items-center overflow-hidden relative",
        className
      )}
    >
      {user?.profilePicture ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_CDNURL!}${user?.profilePicture}`}
          alt=""
          fill={true}
        />
      ) : (
        user?.name?.slice(0, 1)
      )}
    </div>
  );
}
