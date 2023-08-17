import { Schema, model, models } from "mongoose";

const verificationSchema = new Schema({
  code: String,
  userId: Number,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  expireAt: {
    type: Date,
    default: () => Date.now() + 3 * 60 * 1000,
  },
});

const Verification =
  models.verification || model("verification", verificationSchema);

export default Verification;
