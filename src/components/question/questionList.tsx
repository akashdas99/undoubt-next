import { getQuestions } from "@/services/question";
import QuestionCard from "./questionCard";
import { User } from "@/models/user";

interface Question {
  _id: string;
  description: string;
  author: User;
  createdAt: string;
  answers: string[];
}
const QuestionList: React.FC = async () => {
  const questions: Question[] = await getQuestions();
  console.log(questions);
  return (
    <div className="px-[8vw] mt-8">
      <div className="active-neo section-heading mb-2">Recent Questions</div>
      {questions.length === 0 ? (
        <p>No Questions</p>
      ) : (
        <div className="flex flex-col gap-5">
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
