import { Schema, model, models } from "mongoose";

const ForgotPassSchema = new Schema({
  code: String,
  email: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  expireAt: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000,
  },
});

const ForgotPass = models.forgotPass || model("forgotPass", ForgotPassSchema);

export default ForgotPass;
