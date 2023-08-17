import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import User from "@model/User";
import { compare, genSaltSync, hash } from "bcryptjs";

export default async function handler(req, res) {
  const session = await getServerSession(
    req,
    res,
    getNextAuthOptions(req, res)
  );
  connectMongo().catch(() => res.json({ error: "Connection failed" }));

  if (req.method === "POST") {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findOne({ userId: session.user.id });
      const check = await compare(oldPassword, user.password);
      if (check) {
        const salt = genSaltSync(10);
        const updatedUser = await User.updateOne(
          { userId: session.user.id },
          { password: await hash(newPassword, salt) }
        );
        res.status(201).json({ status: true });
      } else {
        res.status(404).json({ error: "Incorrect old Password" });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
