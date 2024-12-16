import mongoose, { model, Schema, Document } from "mongoose";

interface IUser extends Document {
    username: string;
    password: string;
  }

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
  userId: {type: mongoose.Types.ObjectId, ref: 'User'}
})

export const UserModel = model<IUser>("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
