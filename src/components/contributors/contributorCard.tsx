import UserImage from "@/components/ui/userImage";
import { cn } from "@/lib/utils";

interface ContributorCardProps {
  user: {
    id: string;
    name: string;
    userName: string;
    profilePicture: string | null;
    questionCount: number;
    answerCount: number;
  };
  rank: number;
}

export default function ContributorCard({ user, rank }: ContributorCardProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-lg font-bold text-muted-foreground w-6 text-center shrink-0">
        {rank}.
      </div>
      <UserImage user={user} className="w-[40px] h-[40px] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate text-sm">{user.name}</div>
        <div className="text-xs truncate">@{user.userName}</div>
      </div>
      <div className="text-xs whitespace-nowrap">
        {user.questionCount} Q - {user.answerCount} A
      </div>
    </div>
  );
}
