import { QuestionType } from "@/lib/types";
import mongoose, { Document, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface Question extends QuestionType, Document {
  author: Types.ObjectId;
  answers: Types.ObjectId[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema: Schema<Question> = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 800,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
questionSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true, trim: true });
  }
  next();
});
const QuestionModel =
  (mongoose.models.Question as mongoose.Model<Question>) ||
  mongoose.model<Question>("Question", questionSchema);
export default QuestionModel;
