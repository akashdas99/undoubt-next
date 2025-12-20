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
  className?: string;
}

export default function ContributorCard({
  user,
  rank,
  className,
}: ContributorCardProps) {
  const contributionCount = user.questionCount + user.answerCount;

  return (
    <div className={cn("p-4 bordered-card", className)}>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
          {rank}
        </div>
        <UserImage user={user} className="w-[50px] h-[50px]" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{user.name}</div>
          <div className="text-sm text-muted-foreground">@{user.userName}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{contributionCount}</div>
          <div className="text-xs text-muted-foreground">
            {user.questionCount} question{user.questionCount !== 1 ? "s" : ""} ·{" "}
            {user.answerCount} answer{user.answerCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
