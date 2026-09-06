import { getProfile } from "@/data/user";
import UserImage from "../ui/userImage";
import ImageUpload from "./imageUpload";

export default async function Profile() {
  const data = await getProfile();

  return (
    <div className="my-xl w-full max-w-content px-xl">
      <div className="bordered-card p-md">
        <h1 className={`mb-xs font-righteous text-display`}>Profile Information</h1>
        <div className="flex flex-col items-start gap-md sm:flex-row sm:justify-between">
          <div className="relative">
            <UserImage user={data} className="w-[36px]" />
            <ImageUpload />
          </div>
          <div className="grid grid-cols-[min-content_auto] text-sm gap-y-2 gap-x-2 flex-1">
            <div className="font-medium opacity-70">Name</div>
            <div>{data?.name}</div>
            <div className="font-medium opacity-70">Username</div>
            <div>{data?.userName}</div>

            <div className="font-medium opacity-70">Registered</div>
            <div>{new Date(data?.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
