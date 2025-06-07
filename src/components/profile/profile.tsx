import { getUser } from "@/services/user";
import { User } from "@/models/user";
import UserImage from "../ui/userImage";
import ImageUpload from "./imageUpload";

export default async function Profile() {
  const data: User = await getUser();

  return (
    <div className="flex items-center justify-center grow">
      <div className="bordered-card p-5 rounded-xl max-w-sm w-4/5">
        <h1 className={`font-righteous text-xl md:text-3xl mb-6`}>
          Profile Information
        </h1>
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-between items-start">
          <div className="relative">
            <UserImage user={data} className="w-[26px]" />
            <ImageUpload />
          </div>
          <div className="grid grid-cols-[min-content_auto] text-sm gap-y-2 gap-x-2 flex-1">
            <div className="font-medium opacity-70">Name</div>
            <div>{data?.name}</div>
            <div className="font-medium opacity-70">Username</div>
            <div>{data?.username}</div>
            <div className="font-medium opacity-70">Profession</div>
            <div>{data?.profession}</div>
            <div className="font-medium opacity-70">Location</div>
            <div>
              {data?.city}, {data?.country}
            </div>
            <div className="font-medium opacity-70">Registered</div>
            <div>{new Date(data?.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
