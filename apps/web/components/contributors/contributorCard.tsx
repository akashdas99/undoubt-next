import UserImage from "@/components/ui/userImage";

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
      <div className="w-6 shrink-0 text-center text-lg font-bold text-muted-foreground">
        {rank}.
      </div>
      <UserImage user={user} className="h-[40px] w-[40px] shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{user.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          @{user.userName}
        </div>
      </div>
      <div className="whitespace-nowrap text-xs text-muted-foreground">
        {user.questionCount} Q - {user.answerCount} A
      </div>
    </div>
  );
}
