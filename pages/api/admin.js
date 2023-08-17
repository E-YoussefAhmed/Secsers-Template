import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
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
      if (session.user.role !== "admin") {
        return res.status(401).json({ error: "You are not authorized!" });
      }
      const users = await User.find(
        { role: "user" },
        {
          userId: 1,
          name: 1,
          email: 1,
          verified: 1,
          balance: 1,
          referralCode: 1,
        }
      ).sort({ createdAt: -1 });
      res.status(201).json(users);
    } catch (error) {
      res.status(404).json({ error });
    }
  }

  if (req.method === "POST") {
    const { _id, balance, userId } = req.body;
    try {
      if (session.user.role !== "admin") {
        return res.status(401).json({ error: "You are not authorized!" });
      }
      const user = await User.findById(_id);
      await User.updateOne({ _id }, { $inc: { balance: +balance } });
      if (user.referralBy) {
        await User.findOneAndUpdate(
          {
            referralCode: user.referralBy,
            "referrals.userId": userId,
          },
          {
            $inc: {
              balance: +balance * 0.02,
              "referrals.$.amount": +balance * 0.02,
            },
          }
        );
      }
      res.status(201).json(user);
    } catch (error) {
      res.status(404).json({ error });
    }
  }

  if (req.method === "DELETE") {
    const { _id } = req.body;
    try {
      if (session.user.role !== "admin") {
        return res.status(401).json({ error: "You are not authorized!" });
      }
      const user = await User.findByIdAndDelete(_id);
      res.status(201).json(user);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
