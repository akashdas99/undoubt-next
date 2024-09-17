// import React, { useEffect, useState } from "react";
// import { loadTopQuestions } from "../services/questionapicalls";
// import QuestionCard from "./QuestionCard";
// import About from "./About";
// import QuestionLoadingCard from "./QuestionLoadingCard";

import { Suspense } from "react";
import QuestionLoadingCard from "./questionLoadingCard";
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
      <Suspense
        fallback={
          <>
            {[...Array(8)].map((question, i) => (
              <QuestionLoadingCard key={i} />
            ))}
          </>
        }
      >
        {questions.length === 0 ? (
          <p>No Questions</p>
        ) : (
          <div className="flex flex-col gap-5">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default QuestionList;
