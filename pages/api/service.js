import connectMongo from "@database/connection";
import { getServerSession } from "next-auth";
import { getNextAuthOptions } from "./auth/[...nextauth]";
import User from "@model/User";
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
      const response = await fetch("https://secsers.com/api/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: process.env.SECSERS_API_KEY,
          action: "services",
        }),
      });
      const data = await response.json();

      res.status(201).json({ status: true, services: data });
    } catch (error) {
      res.status(404).json({ error });
    }
  }

  if (req.method === "POST") {
    const {
      serviceId,
      type,
      quantity,
      link,
      comments,
      answerNumber,
      username,
      hashtags,
      delay,
      date,
    } = req.body;
    try {
      const response = await fetch("https://secsers.com/api/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: process.env.SECSERS_API_KEY,
          action: "services",
        }),
      });
      const data = await response.json();
      const service = data.find((el) => el.service === serviceId);

      if (type === "Default") {
        const charge = quantity * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              quantity,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Package") {
        const charge = quantity * service.rate * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Custom Comments") {
        const commentsLines = comments.split("\n").filter((com) => com.length);
        const charge = commentsLines.length * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              comments,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Custom Comments Package") {
        const commentsLines = comments.split("\n").filter((com) => com.length);
        const charge = commentsLines.length * service.rate * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              comments,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Poll") {
        const charge = quantity * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              quantity,
              answer_number: answerNumber,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Comment Replies") {
        const commentsLines = comments.split("\n").filter((com) => com.length);
        const charge = commentsLines.length * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              comments,
              username,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Invites from Groups") {
        const charge = quantity * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              groups: comments,
              quantity,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (
        type === "Comment Likes" ||
        type === "Mentions User Followers" ||
        type === "Mentions Media Likers" ||
        type === "Mentions Hashtag"
      ) {
        const charge = quantity * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              quantity,
              username,
              media_url: username,
              hashtag: username,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Mentions" || type === "Mentions Custom List") {
        const charge = quantity * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              quantity,
              usernames: comments,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else if (type === "Mentions with Hashtags") {
        const charge = quantity * (service.rate / 1000) * 1.1;
        const checkingUser = await User.findOne(
          { userId: session.user.id },
          { balance: 1 }
        );
        console.log(checkingUser);
        const check = checkingUser.balance >= charge ? true : false;
        if (check) {
          const response = await fetch("https://secsers.com/api/v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: process.env.SECSERS_API_KEY,
              action: "add",
              service: serviceId,
              link,
              quantity,
              hashtags,
              usernames: comments,
            }),
          });
          const data = await response.json();
          if (data.error) {
            res.status(404).json(data);
          } else {
            const user = await User.updateOne(
              { userId: session.user.id },
              { $inc: { balance: -charge, spending: +charge } }
            );
            const order = await Order.create({
              userId: session.user.id,
              orderId: data.order,
              name: service.name,
              quantity,
              serviceLink: link,
            });
            console.log(order);
            res.status(201).json({ status: true, charge });
          }
        } else {
          res.status(404).json({ error: "You have insufficient balance" });
        }
      } else {
        res.status(404).json({ error: "Invalid Service Type" });
      }
      // else if (type === 'Subscriptions') {
      //   const charge = quantity * (service.rate / 1000) * 1.1;
      //   const checkingUser = await User.findOne(
      //     { userId: session.user.id },
      //     { balance: 1 }
      //   );
      //   console.log(checkingUser);
      //   const check = checkingUser.balance >= charge ? true : false;
      //   if (check) {
      //     const response = await fetch("https://secsers.com/api/v2", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         key: process.env.SECSERS_API_KEY,
      //         action: "add",
      //         service: serviceId,
      //         link,
      //         quantity,
      //         hashtags,
      //         usernames: comments,
      //       }),
      //     });
      //     const data = await response.json();
      //     if (data.error) {
      //       res.status(404).json(data);
      //     } else {
      //       const user = await User.updateOne(
      //         { userId: session.user.id },
      //         { $inc: { balance: -charge, spending: +charge } }
      //       );
      //       const order = await Order.create({
      //         userId: session.user.id,
      //         orderId: data.order,
      //         name: service.name,
      //         quantity,
      //         link,
      //       });
      //       console.log(order);
      //       res.status(201).json({ status: true, charge });
      //     }
      //   } else {
      //     res.status(404).json({ error: "You have insufficient balance" });
      //   }
      // }
      // console.log(service, charge, session.user.balance, req.body);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
