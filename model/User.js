import { Schema, model, models } from "mongoose";

const referralsSchema = new Schema({
  userId: Number,
  name: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  amount: Number,
});

const userSchema = new Schema({
  name: String,
  userId: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  verified: Boolean,
  role: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  balance: Number,
  spending: Number,
  referralCode: {
    type: String,
    unique: true,
  },
  referralBy: String,
  referrals: [referralsSchema],
});

const User = models.user || model("user", userSchema);

export default User;
