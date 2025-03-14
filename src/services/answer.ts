import { getUser } from "@/data-access/user";
import dbConnect from "@/lib/dbConnect";
import { AnswerSchema, AnswerType } from "@/lib/types";
import AnswerModel from "@/models/answer";
import QuestionModel from "@/models/question";
import sanitizeHtml from "sanitize-html";

dbConnect();

export async function addAnswer(slug: string, answerData: AnswerType) {
  try {
    //validate question
    const validatedQuestion = AnswerSchema.safeParse({
      ...answerData,
    });
    if (!validatedQuestion?.success) {
      throw new Error(
        JSON.stringify(validatedQuestion?.error?.flatten()?.fieldErrors)
      );
    }
    const userSession = await getUser();

    const answer = new AnswerModel({
      description: sanitizeHtml(validatedQuestion?.data?.description),
    });
    await QuestionModel.findOneAndUpdate(
      { slug },
      { $push: { answers: answer._id } },
      { new: true }
    );
    answer.author = userSession._id;

    const res = await answer.save();
    return JSON.parse(JSON.stringify({ res }));
  } catch (e) {
    console.log(e);
    return {
      error: { type: "serverError", message: "Something went wrong" },
    };
  }
}
