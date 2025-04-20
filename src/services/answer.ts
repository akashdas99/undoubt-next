import { getUser } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import { AnswerSchema, AnswerType } from "@/lib/types";
import AnswerModel from "@/models/answer";
import QuestionModel from "@/models/question";
import sanitizeHtml from "sanitize-html";

export async function getAnswersByQuestionSlug(slug: string) {
  try {
    await dbConnect();
    const answers = await QuestionModel.aggregate([
      {
        $match: {
          slug: slug,
        },
      },
      {
        $lookup: {
          from: "answers",
          localField: "answers",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, profilePicture: 1 } }],
                as: "author",
              },
            },
            {
              $unwind: "$author",
            },
          ],
          as: "answers",
        },
      },

      {
        $unwind: "$answers",
      },
      {
        $sort: {
          "answers.updatedAt": -1,
        },
      },
    ]);
    return JSON.parse(JSON.stringify(answers?.map((a) => a?.answers)));
  } catch (e) {
    console.log(e);
    return {
      error: { type: "serverError", message: "Something went wrong" },
    };
  }
}
export async function addAnswer(slug: string, answerData: AnswerType) {
  try {
    await dbConnect();
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
