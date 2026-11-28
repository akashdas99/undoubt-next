import { apiRequest, httpMethod } from "@/lib/api/request";
import { userEndpoints } from "@/lib/domain/endpoints";
import { Card, CardContent } from "@workspace/ui/components/card";
import ContributorCard from "./contributorCard";

const TopContributorsList: React.FC = async () => {
  const { response } = await apiRequest<
    Array<{
      id: string;
      name: string;
      userName: string;
      profilePicture: string | null;
      createdAt: string | Date;
      questionCount: number;
      answerCount: number;
    }>
  >(userEndpoints.top, { method: httpMethod.get, searchParams: { limit: 10 } });
  const contributors = response ?? [];

  const activeContributors = contributors.filter(
    (user) => user.questionCount > 0 || user.answerCount > 0
  );

  if (activeContributors.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-[calc(var(--spacing-sm)+var(--spacing-2xl)+var(--spacing-xs)*3+var(--spacing-md))] z-10 hidden self-start px-md lg:block">
      <div className="mb-md font-display text-display">Top Contributors</div>
      <Card size="sm" className="w-(--container-dialog)">
        <CardContent className="flex flex-col gap-sm">
          {activeContributors.map((user, index) => (
            <ContributorCard key={user.id} user={user} rank={index + 1} />
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default TopContributorsList;
