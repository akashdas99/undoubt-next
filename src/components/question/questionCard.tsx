interface Props {
  question: {
    description: string;
    author: {
      name: string;
    };
    createdAt: Date;
    answers: string[];
  };
}
const QuestionCard = ({ question }: Props) => {
  return (
    <div className="p-[1em] neo">
      <div className="title">{question.description}</div>
      <div className="author-section">
        <div className="author">
          - {question.author.name}
          <span className="date">
            {" "}
            | on {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="card-footer">{question.answers.length} Answers</div>
    </div>
  );
};

export default QuestionCard;
