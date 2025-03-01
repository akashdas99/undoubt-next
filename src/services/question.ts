import QuestionModel from "@/models/question";

export const getQuestions = async () => {
  try {
    const data = await QuestionModel.find()
      .populate("author")
      .sort([["_id", "asc"]])
      .lean();
    return data;
  } catch (err) {
    throw err;
  }
};
export const searchQuestions = async (keyword: string) => {
  try {
    const data = await QuestionModel.find({
      description: { $regex: keyword, $options: "i" },
    }).lean();
    return data;
  } catch (err) {
    throw err;
  }
};
