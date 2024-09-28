import QuestionCard from "./questionCard";

interface Question {
  _id: string;
  description: string;
  author: {
    name: string;
  };
  createdAt: Date;
  answers: string[];
}
const QuestionList: React.FC = async () => {
  const data = await fetch(`${process.env.REACT_APP_BACKEND}/questions`);
  const questions: Question[] = await data.json();

  return (
    <div className="px-[10%]">
      <div className="active-neo section-heading">Recent Questions</div>
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
