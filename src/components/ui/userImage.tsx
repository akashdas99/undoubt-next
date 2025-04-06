import { cn } from "@/lib/utils";
import { User } from "@/models/user";
import Image from "next/image";
import React from "react";

export default function UserImage({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-10 aspect-square shrink-0 bg-accent border-2 border-primary border-solid font-bold align-middle rounded-full flex justify-center items-center overflow-hidden relative",
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
