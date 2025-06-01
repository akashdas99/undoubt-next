import { getUser } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import { AnswerSchema, AnswerType } from "@/lib/types";
import AnswerModel from "@/models/answer";
import QuestionModel from "@/models/question";
import sanitizeHtml from "sanitize-html";
import { getSession } from "@/lib/session";

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
    //validate answer
    const validatedAnswer = AnswerSchema.safeParse({
      ...answerData,
    });
    if (!validatedAnswer?.success) {
      throw new Error(
        JSON.stringify(validatedAnswer?.error?.flatten()?.fieldErrors)
      );
    }
    const userSession = await getUser();

    const answer = new AnswerModel({
      description: sanitizeHtml(validatedAnswer?.data?.description),
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
export async function updateAnswer(id: string, answerData: AnswerType) {
  try {
    await dbConnect();
    //validate answer
    const validatedAnswer = AnswerSchema.safeParse({
      ...answerData,
    });
    if (!validatedAnswer?.success) {
      throw new Error(
        JSON.stringify(validatedAnswer?.error?.flatten()?.fieldErrors)
      );
    }
    const userSession = await getUser();

    const answer = await AnswerModel.findById(id);
    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer?.author?.toString() !== userSession?._id?.toString()) {
      throw new Error("Unauthorised update request");
    }
    answer.description = sanitizeHtml(validatedAnswer?.data?.description);
    const res = await answer.save();
    return JSON.parse(JSON.stringify({ res }));
  } catch (e) {
    if (e instanceof Error) console.log(e?.message);
    return {
      error: { type: "serverError", message: "Something went wrong" },
    };
  }
}
export async function deleteAnswer(id: string, slug: string) {
  try {
    await dbConnect();

    const userSession = await getSession();

    const answer = await AnswerModel.findById(id);
    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer?.author?.toString() !== userSession?.id?.toString()) {
      throw new Error("Unauthorised delete request");
    }
    const res = await answer.deleteOne();
    await QuestionModel.findOneAndUpdate(
      { slug },
      { $pull: { answers: answer._id } },
      { new: true }
    );
    return JSON.parse(JSON.stringify({ res }));
  } catch (e) {
    if (e instanceof Error) console.log(e?.message);
    return {
      error: { type: "serverError", message: "Something went wrong" },
    };
  }
}
