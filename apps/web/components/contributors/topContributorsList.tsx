import { getTopContributors } from "@/data/user";
import { Card, CardContent } from "@workspace/ui/components/card";
import ContributorCard from "./contributorCard";

const TopContributorsList: React.FC = async () => {
  const contributors = await getTopContributors(10);

  // Filter out users with 0 contributions
  const activeContributors = contributors.filter(
    (user) => user.questionCount > 0 || user.answerCount > 0,
  );

  if (activeContributors.length === 0) {
    return null; // Don't show the section if there are no contributors
  }

  return (
    <aside className="sticky top-17 z-10 hidden self-start p-sm lg:block">
      <div className="mb-xs font-righteous text-display">Top Contributors</div>
      <Card size="sm" className="w-[384px]">
        <CardContent className="flex flex-col gap-3">
          {activeContributors.map((user, index) => (
            <ContributorCard key={user.id} user={user} rank={index + 1} />
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default TopContributorsList;
