import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IComment extends Document {
  text: string;
  createdBy: IUser['_id'];
  solutionId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  text: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  solutionId: {
    type: Schema.Types.ObjectId,
    ref: 'Solution',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
