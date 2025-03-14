import React from "react";

export default function UserImage({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 bg-accent border-2 border-primary border-solid shrink-0 font-bold align-middle rounded-full flex justify-center items-center">
      {name?.slice(0, 1)}
    </div>
  );
}
