import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import ForgotPass from "@model/ForgotPass";
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
    const { tempPass, newPass, email } = req.body;
    try {
      const user = await User.findOne({ email });
      const verify = await ForgotPass.findOne({
        email: user.email,
        expireAt: { $gt: Date.now() },
      });
      if (verify) {
        const check = await compare(tempPass, verify.code);
        if (check) {
          const salt = genSaltSync(10);
          const updatedUser = await User.updateOne(
            { email: user.email },
            { password: await hash(newPass, salt) }
          );
          let oldCode = await ForgotPass.deleteMany({
            email: user.email,
          });
          res.status(200).json({ status: true });
        } else {
          res.status(404).json({ error: "Incorrect code" });
        }
      } else {
        res.status(404).json({ error: "Code expired, Please try again later" });
      }
    } catch (error) {
      res.status(404).json({ error: "Something went wrong" });
    }
  }
}
