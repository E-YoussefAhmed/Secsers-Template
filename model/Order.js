import { Schema, model, models } from "mongoose";

const orderSchema = new Schema({
  userId: Number,
  orderId: Number,
  name: String,
  quantity: Number,
  serviceLink: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Order = models.order || model("order", orderSchema);

export default Order;
