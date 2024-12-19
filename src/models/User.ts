import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
}

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
});

export const UserModel = model<IUser>("User", UserSchema);