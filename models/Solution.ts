import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProblem } from './Problem';

export interface ISolution extends Document {
  text: string;
  createdBy: IUser['_id'];
  problemId: IProblem['_id'];
  upvotes: number;
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const SolutionSchema = new Schema<ISolution>({
  text: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Solution: Model<ISolution> = mongoose.models.Solution || mongoose.model<ISolution>('Solution', SolutionSchema);

export default Solution;
