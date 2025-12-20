import { unstable_cache } from "next/cache";
import { getTopContributors } from "@/data/user";
import ContributorCard from "./contributorCard";

const getCachedTopContributors = unstable_cache(
  async () => getTopContributors(10),
  ["top-contributors"],
  {
    tags: ["contributors"],
    revalidate: 600, // Revalidate every 10 minutes
  }
);

const TopContributorsList: React.FC = async () => {
  const contributors = await getCachedTopContributors();

  // Filter out users with 0 contributions
  const activeContributors = contributors.filter(
    (user) => user.questionCount > 0 || user.answerCount > 0
  );

  if (activeContributors.length === 0) {
    return null; // Don't show the section if there are no contributors
  }

  return (
    <aside className="hidden lg:block p-3 sticky z-10 top-[60px] self-start">
      <div className="mb-3 font-righteous text-xl md:text-3xl">
        Top Contributors
      </div>
      <div className="space-y-3 p-3 pr-5 bordered-card w-[384px]">
        {activeContributors.map((user, index) => (
          <ContributorCard key={user.id} user={user} rank={index + 1} />
        ))}
      </div>
    </aside>
  );
};

export default TopContributorsList;
