import { getUser } from "@/data-access/user";
import { User } from "@/models/user";
import UserImage from "../ui/userImage";

export default async function Profile(): Promise<JSX.Element> {
  const data: User = await getUser();

  return (
    <div className="flex items-center justify-center grow">
      <div className="neo p-8 rounded-xl max-w-sm w-4/5">
        <h1 className={`font-righteous text-xl mb-6`}>Profile Information</h1>
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-2 sm:justify-between">
          <UserImage name={data?.name} />

          <div className="grid grid-cols-2 text-sm gap-y-2 gap-x-2">
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
