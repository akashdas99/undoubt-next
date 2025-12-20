import QuestionList from "@/components/question/questionList";
import TopContributorsList from "@/components/contributors/topContributorsList";

export default function Home() {
  return (
    <div className="flex gap-6 w-full justify-center">
      {/* Main Content */}
      <QuestionList />

      {/* Sticky Sidebar - sticks to top when scrolling */}
      <TopContributorsList />
    </div>
  );
}
