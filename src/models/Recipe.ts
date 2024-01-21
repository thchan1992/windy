import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IRecipe extends Document {
  title: string;
  steps: string;
  createdBy: IUser["_id"];
}

const recipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  steps: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
