import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import Order from "@model/Order";
import User from "@model/User";

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
      let actualSpending = 0;
      dbOrders.forEach((el) => {
        actualSpending += +data[el.orderId].charge * 1.1;
      });
      console.log(actualSpending);
      res.status(201).json({ actualSpending });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  if (req.method === "PUT") {
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
      let actualSpending = 0;
      dbOrders.forEach((el) => {
        actualSpending += +data[el.orderId].charge * 1.1;
      });
      const user = await User.findOne(
        { userId: session.user.id },
        { spending: 1, balance: 1 }
      );
      let newBalance = user.balance;
      let newSpending = user.spending;
      if (actualSpending < user.spending) {
        const diff = +user.spending - +actualSpending;
        newSpending -= diff;
        newBalance += diff;
      } else if (actualSpending > user.spending) {
        const diff = +actualSpending - +user.spending;
        newSpending += diff;
        newBalance -= diff;
      }
      await User.updateOne(
        { userId: session.user.id },
        { $set: { balance: newBalance, spending: newSpending } }
      );
      res.status(201).json({ newBalance, newSpending });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error });
    }
  }
}
