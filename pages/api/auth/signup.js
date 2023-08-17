import connectMongo from "@database/connection";
import User from "@model/User";
import { hash, genSaltSync } from "bcryptjs";

export default async function handler(req, res) {
  connectMongo().catch(() => res.json({ error: "Connection failed" }));

  if (req.method === "POST") {
    if (!req.body) return res.status(404).json({ error: "No data found" });
    const { name, email, password, referralCode } = req.body;

    const check = await User.findOne({ email });
    if (check)
      return res
        .status(422)
        .json({ email: true, message: "Email already exists" });

    if (referralCode) {
      const check = await User.findOne({ referralCode });
      if (!check)
        return res
          .status(422)
          .json({ referral: true, message: "Referral code doesn't exists" });
    }
    try {
      const salt = genSaltSync(10);
      let userId;
      let referral = "";
      while (true) {
        userId = Math.floor(Math.random() * 100000000);
        const check = await User.findOne({ userId });
        if (!check) break;
      }
      while (true) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        for (let i = 0; i < 10; i++) {
          referral += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const check = await User.findOne({ referralCode: referral });
        if (!check) break;
      }
      const user = await User.create({
        name,
        email,
        password: await hash(password, salt),
        verified: false,
        userId,
        balance: 0,
        referralCode: referral,
        referralBy: referralCode ? referralCode : null,
        referrals: [],
        role: "user",
      });
      const referralOne = await User.findOneAndUpdate(
        { referralCode },
        {
          $push: { referrals: { userId, name, amount: 0 } },
        }
      );
      res.status(201).json({ status: true, user });
    } catch (error) {
      res.status(404).json({ error });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only POST Accepted" });
  }
}
