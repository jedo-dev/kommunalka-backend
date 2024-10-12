import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    ratioHot: Number,
    ratioCold: Number,
    ratioElec: Number,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('User', UserSchema);
