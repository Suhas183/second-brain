import { Schema, model, Document, Types } from 'mongoose';

export interface IContent extends Document {
  title: string;
  link: string;
  tags: Types.ObjectId[];
  userId: Types.ObjectId;
}

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
);

export const ContentModel = model<IContent>('Content', ContentSchema);
