import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import User from "@model/User";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  const session = await getServerSession(
    req,
    res,
    getNextAuthOptions(req, res)
  );
  connectMongo().catch(() => res.json({ error: "Connection failed" }));

  if (req.method === "POST") {
    const { name, password } = req.body;
    try {
      const user = await User.findOne({ userId: session.user.id });
      const check = await compare(password, user.password);
      if (check) {
        const updatedUser = await User.updateOne(
          { userId: session.user.id },
          { name }
        );
        res.status(201).json({ status: true });
      } else {
        res.status(404).json({ error: "Invalid Password" });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
