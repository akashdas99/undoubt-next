"use server";

import { getUser } from "@/data-access/user";
import dbConnect from "@/lib/dbConnect";
import { QuestionSchema, QuestionType } from "@/lib/types";
import QuestionModel from "@/models/question";

dbConnect();
export async function addQuestion(questionData: QuestionType) {
  try {
    //validate question
    const validatedQuestion = QuestionSchema.safeParse({
      ...questionData,
    });
    if (!validatedQuestion?.success) {
      throw new Error(
        JSON.stringify(validatedQuestion?.error?.flatten()?.fieldErrors)
      );
    }
    const userSession = await getUser();
    console.log("validatedQuestion", validatedQuestion);
    const question = new QuestionModel(validatedQuestion?.data);
    question.author = userSession._id;

    const res = await question.save();
    return JSON.parse(JSON.stringify({ res }));
  } catch (e) {
    console.log(e);
    return {
      error: { type: "serverError", message: "Something went wrong" },
    };
  }
}
