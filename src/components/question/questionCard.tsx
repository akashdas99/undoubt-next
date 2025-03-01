import dayjs from "dayjs";

type Props = {
  question: {
    description: string;
    author: {
      name: string;
    };
    createdAt: string;
    answers: string[];
  };
};
const QuestionCard = ({ question }: Props) => {
  return (
    <div className="p-[1em] neo">
      <div className="title">{question.description}</div>
      <div className="author-section">
        <div className="author">
          - <span className="font-semibold"> {question.author.name}</span> |
          <span className="date text-[16px] font-light">
            {" "}
            {dayjs(question?.createdAt).format("MMM D, YYYY h:mm A")}
          </span>
        </div>
      </div>

      <div className="card-footer">{question.answers.length} Answers</div>
    </div>
  );
};

export default QuestionCard;
