import { getTopContributors } from "@/data/user";
import { Card, CardContent } from "@workspace/ui/components/card";
import ContributorCard from "./contributorCard";

const TopContributorsList: React.FC = async () => {
  const contributors = await getTopContributors(10);

  // Filter out users with 0 contributions
  const activeContributors = contributors.filter(
    (user) => user.questionCount > 0 || user.answerCount > 0
  );

  if (activeContributors.length === 0) {
    return null; // Don't show the section if there are no contributors
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
