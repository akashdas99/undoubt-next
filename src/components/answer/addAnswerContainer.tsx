import { getSession } from "@/lib/session";
import React from "react";
import AddAnswer from "./addAnswer";
import { Skeleton } from "../ui/skeleton";

export default async function AddAnswerContainer() {
  const session = await getSession();
  return <AddAnswer isLoggedIn={!!session} />;
}

export const AddAnswerContainerSkeleton = () => {
  return (
    <div className="flex items-center justify-start">
      <Skeleton className="h-10 w-[150px] rounded-md" />
    </div>
  );
};
