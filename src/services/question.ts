import { getUser } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import { QuestionSchema, QuestionType } from "@/lib/types";
import QuestionModel from "@/models/question";
import { User } from "@/models/user";
import sanitizeHtml from "sanitize-html";

export const getQuestions = async () => {
  try {
    await dbConnect();
    const data = await QuestionModel.find()
      .populate<{ author: User }>("author", "name profilePicture")
      .sort({ updatedAt: -1 });
    return data;
  } catch (err) {
    throw err;
  }
};
export const getQuestionBySlug = async (slug: string) => {
  try {
    await dbConnect();
    const data = await QuestionModel.findOne({ slug }).populate<{
      author: User;
    }>("author", "name profilePicture");
    return data;
  } catch (err) {
    throw err;
  }
};
export const searchQuestions = async (keyword: string) => {
  try {
    await dbConnect();
    const data = await QuestionModel.find({
      title: { $regex: keyword, $options: "i" },
    }).lean();
    return data;
  } catch (err) {
    throw err;
  }
};
export async function addQuestion(questionData: QuestionType) {
  try {
    await dbConnect();
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

    const question = new QuestionModel({
      title: validatedQuestion?.data?.title,
    });
    if (validatedQuestion?.data?.description)
      question.description = sanitizeHtml(validatedQuestion?.data?.description);

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
