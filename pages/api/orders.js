import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import Order from "@model/Order";

export default async function handler(req, res) {
  const session = await getServerSession(
    req,
    res,
    getNextAuthOptions(req, res)
  );
  connectMongo().catch(() => res.json({ error: "Connection failed" }));

  if (req.method === "GET") {
    try {
      const dbOrders = await Order.find({ userId: session.user.id }).sort({
        createdAt: -1,
      });
      const ids = dbOrders.map((order) => order.orderId).join(",");
      const response = await fetch("https://secsers.com/api/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: process.env.SECSERS_API_KEY,
          action: "status",
          orders: ids,
        }),
      });
      const data = await response.json();
      const orders = dbOrders.map((order) => {
        return {
          id: order.orderId,
          date: order.createdAt,
          serviceLink: order.serviceLink,
          charge: data[order.orderId].charge * 1.1,
          startCount: data[order.orderId].start_count,
          quantity: order.quantity,
          name: order.name,
          remains: data[order.orderId].remains,
          status: data[order.orderId].status,
        };
      });
      res.status(201).json({ orders });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
