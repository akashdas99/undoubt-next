import QuestionList from "@/components/question/questionList";
import TopContributorsList from "@/components/contributors/topContributorsList";

export default function Home() {
  return (
    <>
      <TopContributorsList />
      <QuestionList />
    </>
  );
}
