import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@database/connection";
import User from "@model/User";
import { compare } from "bcryptjs";
import clientPromise from "@database/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { parseCookies, setCookie } from "nookies";

export const getNextAuthOptions = (req, res) => {
  const cookies = parseCookies({ req });
  let maxAge = 60 * 60;

  if (req.body?.rememberMe) {
    maxAge = req.body?.rememberMe == "true" ? 30 * 24 * 60 * 60 : 60 * 60;

    setCookie({ res }, "remember-me", req.body.rememberMe, {
      maxAge,
      path: "/",
    });
  } else if (cookies["remember-me"]) {
    maxAge = cookies["remember-me"] == "true" ? 30 * 24 * 60 * 60 : 60 * 60;
  }

  const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: "Credentials",

        async authorize(credentials, req) {
          connectMongo().catch((error) => {
            console.log(error);
          });

          const { email, password } = credentials;
          const user = await User.findOne({ email });
          if (user) {
            const check = await compare(password, user.password);
            if (!check) {
              throw new Error("password");
            }
            return user;
          } else {
            throw new Error("email");
          }
        },
      }),
    ],
    pages: {
      signIn: "/",
    },
    session: {
      strategy: "jwt",
      maxAge,
    },
    jwt: {
      maxAge,
    },
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.name = user.name;
          token.email = user.email;
          token.verified = user.verified;
          token.id = user.userId;
          token.balance = user.balance;
          token.referralCode = user.referralCode;
          token.referrals = user.referrals;
          token.role = user.role;
          token.spending = user.spending;
        }
        if (trigger === "update") {
          return { ...token, ...session.user };
        }
        return { ...token, ...user };
      },
      async session({ session, token }) {
        if (token) {
          session.user.image = "";
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.verified = token.verified;
          session.user.id = token.id;
          session.user.balance = token.balance;
          session.user.spending = token.spending;
          session.user.referralCode = token.referralCode;
          session.user.referrals = token.referrals;
          session.user.role = token.role;
        }
        return session;
      },
    },
  };
  return authOptions;
};

// export default NextAuth(authOptions);

export default async function auth(req, res) {
  return await NextAuth(req, res, getNextAuthOptions(req, res));
}
