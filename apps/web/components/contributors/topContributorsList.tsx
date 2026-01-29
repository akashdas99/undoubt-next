import { cacheLife, cacheTag } from "next/cache";
import { getTopContributors } from "@/data/user";
import ContributorCard from "./contributorCard";

async function getCachedTopContributors() {
  "use cache";
  cacheLife("hours");
  cacheTag("contributors");
  return getTopContributors(10);
}

const TopContributorsList: React.FC = async () => {
  const contributors = await getCachedTopContributors();

  // Filter out users with 0 contributions
  const activeContributors = contributors.filter(
    (user) => user.questionCount > 0 || user.answerCount > 0,
  );

  if (activeContributors.length === 0) {
    return null; // Don't show the section if there are no contributors
  }

  return (
    <aside className="hidden lg:block p-3 sticky z-10 top-[60px] self-start">
      <div className="mb-3 font-righteous text-3xl">Top Contributors</div>
      <div className="space-y-3 p-3 pr-5 bordered-card w-[384px]">
        {activeContributors.map((user, index) => (
          <ContributorCard key={user.id} user={user} rank={index + 1} />
        ))}
      </div>
    </aside>
  );
};

export default TopContributorsList;
