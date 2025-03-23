import { User } from "@/models/user";
import Image from "next/image";
import React from "react";

export default function UserImage({ user }: { user: User }) {
  return (
    <div className="w-10 h-10 bg-accent border-2 border-primary border-solid shrink-0 font-bold align-middle rounded-full flex justify-center items-center overflow-hidden relative">
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
