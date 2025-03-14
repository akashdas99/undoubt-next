import mongoose, { Schema, Types } from "mongoose";

export interface Answer extends Document {
  author: Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
const answerSchema: Schema<Answer> = new Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const AnswerModel =
  (mongoose.models.Answer as mongoose.Model<Answer>) ||
  mongoose.model<Answer>("Answer", answerSchema);
export default AnswerModel;
