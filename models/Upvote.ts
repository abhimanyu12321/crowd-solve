import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { ISolution } from './Solution';

export interface IUpvote extends Document {
  userId: IUser['_id'];
  solutionId: ISolution['_id'];
  createdAt: Date;
}

const UpvoteSchema = new Schema<IUpvote>({
  userId: {
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

// Ensure a user can only upvote a solution once
UpvoteSchema.index({ userId: 1, solutionId: 1 }, { unique: true });

const Upvote: Model<IUpvote> = mongoose.models.Upvote || mongoose.model<IUpvote>('Upvote', UpvoteSchema);

export default Upvote;
