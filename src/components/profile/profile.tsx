import { getUser } from "@/data-access/user";
import { User } from "@/models/user";
import { Righteous } from "next/font/google";
const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
});
export default async function Profile(): Promise<JSX.Element> {
  const data: User & { createdAt: string | number | Date } = await getUser();

  return (
    <div className="flex items-center justify-center grow">
      <div className="neo p-8 rounded-xl max-w-sm w-4/5">
        <h1 className={`${righteous?.className} text-xl mb-6`}>
          Profile Information
        </h1>
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 sm:justify-between">
          <div className="w-10 h-10 bg-accent border-2 border-primary border-solid  font-bold align-middle rounded-full flex justify-center items-center">
            {data?.name?.slice(0, 1)}
          </div>
          <div className="grid grid-cols-2 text-sm gap-y-2 gap-x-8">
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
