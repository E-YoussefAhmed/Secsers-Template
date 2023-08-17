import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import Verification from "@model/Verification";
import { compare, genSaltSync, hash } from "bcryptjs";
import { createTransport } from "nodemailer";
import Mailgen from "mailgen";
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
      const code = await Verification.find({
        userId: session.user.id,
        expireAt: { $gt: Date.now() },
      });
      if (code.length) {
        res.status(200).json({ status: true });
      } else {
        let oldCode = await Verification.deleteMany({
          userId: session.user.id,
        });
        let code = "";
        while (true) {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
          for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          const check = await Verification.findOne({ code });
          if (!check) break;
        }
        const salt = genSaltSync(10);
        const newCode = await Verification.create({
          userId: session.user.id,
          code: await hash(code, salt),
        });
        // Send email to user with verification code
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
            name: "Your Verification Code",
            dictionary: {
              "Verification Code": code,
            },
            outro: "Hope you are happy with us!",
          },
        };

        let mail = MailGenerator.generate(response);

        let data = {
          from: process.env.GMAIL_EMAIL,
          to: session.user.email,
          subject: "Verification Code",
          html: mail,
        };
        transporter.sendMail(data, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent");
          }
        });

        res.status(200).json({ status: true });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  }

  if (req.method === "POST") {
    const { code } = req.body;
    try {
      const verify = await Verification.findOne({
        userId: session.user.id,
        expireAt: { $gt: Date.now() },
      });
      if (verify) {
        const check = await compare(code, verify.code);
        if (check) {
          const user = await User.updateOne(
            { userId: session.user.id },
            { $set: { verified: true } }
          );
          console.log(user);
          let oldCode = await Verification.deleteMany({
            userId: session.user.id,
          });
          res.status(200).json({ status: true, verified: true });
        } else {
          res.status(404).json({ error: "Incorrect code" });
        }
      } else {
        res
          .status(404)
          .json({ error: "Code expired, Please send another code" });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  }

  if (req.method === "PUT") {
    try {
      const code = await Verification.findOne({
        userId: session.user.id,
        expireAt: { $gt: Date.now() },
      });
      if (code) {
        res.status(404).json({ expireAt: code.expireAt });
      } else {
        let oldCode = await Verification.deleteMany({
          userId: session.user.id,
        });
        let code = "";
        while (true) {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
          for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          const check = await Verification.findOne({ code });
          if (!check) break;
        }
        const salt = genSaltSync(10);
        const newCode = await Verification.create({
          userId: session.user.id,
          code: await hash(code, salt),
        });
        res.status(200).json({ message: "A new code has been sent" });
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
