import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import ForgotPass from "@model/ForgotPass";
import User from "@model/User";
import { genSaltSync, hash } from "bcryptjs";
import { createTransport } from "nodemailer";
import Mailgen from "mailgen";

export default async function handler(req, res) {
  const session = await getServerSession(
    req,
    res,
    getNextAuthOptions(req, res)
  );
  connectMongo().catch(() => res.json({ error: "Connection failed" }));

  if (req.method === "POST") {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user.verified)
        return res
          .status(403)
          .json({ message: "Your account is not verified!" });
      const code = await ForgotPass.find({
        email: user.email,
        expireAt: { $gt: Date.now() },
      });
      if (code.length) {
        res.status(200).json({
          status: true,
          message: "Temporary password already sent to your email",
        });
      } else {
        let oldCode = await ForgotPass.deleteMany({
          email: user.email,
        });
        let code = "";
        while (true) {
          const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz!@#$%&*";
          for (let i = 0; i < 15; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          const check = await ForgotPass.findOne({ code });
          if (!check) break;
        }
        const salt = genSaltSync(10);
        const newCode = await ForgotPass.create({
          email: user.email,
          code: await hash(code, salt),
        });
        // Send email to user with ForgotPass code
        // let testAccount = await createTestAccount();
        let transporter = createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
          },
        });

        let MailGenerator = new Mailgen({
          theme: "default",
          product: {
            name: "Secsers",
            link: "https://Secsers.com",
            copyright: "Copyright © 2023 Scorpions. All rights reserved.",
          },
        });

        let response = {
          body: {
            name: "Your Temporary Password",
            dictionary: {
              Password: code,
            },
            outro: "Hope you are happy with us!",
          },
        };

        let mail = MailGenerator.generate(response);

        let data = {
          from: process.env.GMAIL_EMAIL,
          to: user.email,
          subject: "Temporary Password",
          html: mail,
        };
        transporter.sendMail(data, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent");
          }
        });

        res.status(200).json({
          status: true,
          message: "Temporary password has been sent to your email",
        });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
