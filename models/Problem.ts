import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export type Location = 'Noida' | 'Delhi' | 'Gurgaon';

export interface IProblem extends Document {
  title: string;
  description: string;
  location: Location;
  createdBy: IUser['_id'];
  createdAt: Date;
}

const ProblemSchema = new Schema<IProblem>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    enum: ['Noida', 'Delhi', 'Gurgaon'],
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);

export default Problem;
