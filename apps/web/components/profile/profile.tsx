import type { ReactNode } from "react";
import { getProfile } from "@/data/user";
import UserImage from "../ui/userImage";
import ImageUpload from "./imageUpload";

function ProfileRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xxs text-sm sm:flex-row sm:gap-xs">
      <div className="shrink-0 font-medium opacity-70">{label}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default async function Profile() {
  const data = await getProfile();

  return (
    <div className="my-xl w-full max-w-content px-xl">
      <div className="bordered-card p-md">
        <h1 className="mb-xs font-display text-display">Profile Information</h1>
        <div className="flex flex-col items-start gap-md sm:flex-row sm:justify-between">
          <div className="relative">
            <UserImage user={data} className="w-2xl" />
            <ImageUpload />
          </div>
          <div className="flex flex-1 flex-col gap-xs text-sm">
            <ProfileRow label="Name">{data?.name}</ProfileRow>
            <ProfileRow label="Username">{data?.userName}</ProfileRow>
            <ProfileRow label="Registered">
              {new Date(data?.createdAt).toLocaleDateString()}
            </ProfileRow>
          </div>
        </div>
      </div>
    </div>
  );
}
