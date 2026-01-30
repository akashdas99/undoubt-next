import { getProfile } from "@/data/user";
import UserImage from "../ui/userImage";
import ImageUpload from "./imageUpload";

export default async function Profile() {
  const data = await getProfile();

  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="bordered-card p-[1em]">
        <h1 className={`font-righteous text-3xl mb-2`}>Profile Information</h1>
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-between items-start">
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
