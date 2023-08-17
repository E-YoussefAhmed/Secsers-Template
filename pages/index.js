import React, { useState } from "react";
import Image from "next/image";
import {
  FaChevronDown,
  FaCircleCheck,
  FaUser,
  FaRegFaceSmile,
  FaUnlockKeyhole,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { PiSealCheckFill } from "react-icons/pi";
import { FaCrown } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import Link from "next/link";
import { MenuItem, duration } from "@mui/material";
import { useRouter } from "next/router";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SignUp from "@components/Signup";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import { getNextAuthOptions } from "@pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import ForgotPassword from "@components/ForgotPassword";
import User from "@model/User";
import Order from "@model/Order";
import connectMongo from "@database/connection";
import { motion } from "framer-motion";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home({ users, orders }) {
  const [show, setShow] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate,
    onSubmit,
  });

  async function validate(values) {
    const errors = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8 || values.password.length > 20) {
      errors.password = "Must be greater than 8 and less than 20";
    } else if (values.password.includes(" ")) {
      errors.password = "Invalid Password";
    }
    return errors;
  }

  async function onSubmit(values) {
    setLoading(true);
    const status = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackUrl: "/order",
    });

    if (status.ok) {
      router.push("/order");
    } else {
      if (status.error === "password") {
        formik.errors.password = "Incorrect password";
      } else if (status.error === "email") {
        formik.errors.email = "No user found with that email";
      }
    }
    setLoading(false);
  }

  return (
    <main className="w-screen h-screen flex justify-center px-10">
      <section className="w-[1100px] lg:pt-[104px] py-10 overflow-y-auto overflow-x-hidden">
        <motion.nav
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "tween" }}
          className="w-full flex justify-between"
        >
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="logo"
                width={197}
                height={56}
                className="h-[56px] object-contain"
              />
            </Link>
          </div>
          <div className="lg:hidden flex item">
            <FaBars onClick={() => setShowNav(true)} size={30} />
          </div>
          <ul className="lg:flex hidden">
            <li className="flex text-lg font-extrabold items-center mx-10 leading-5">
              <button
                onClick={(event) => setAnchorEl(event.currentTarget)}
                type="button"
                className="flex items-center"
              >
                Dark{" "}
                <span className="block mx-2">
                  <FaChevronDown size={19} />
                </span>
              </button>
              <Menu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "black",
                  },
                }}
              >
                <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                  Theme 1
                </MenuItem>
                <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                  Theme 2
                </MenuItem>
                <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                  Theme 3
                </MenuItem>
              </Menu>
            </li>
            <li className="flex text-lg font-extrabold items-center mx-10 leading-5">
              <button type="button">AR</button>
            </li>
            <li>
              <button
                className="h-[77px] w-[203px] bg-primary rounded flex items-center p-3 mx-10 transition-all duration-300 hover:opacity-60"
                onClick={() => setShow(true)}
                type="button"
              >
                <div className="w-[50px] h-[50px] rounded-full bg-[#140C34] flex justify-center items-center">
                  <div className="w-[30px] h-[30px] rounded-full bg-[#D9D9D9] flex justify-center items-center">
                    <FaUser size={22} color="#140C34" />
                  </div>
                </div>
                <span className="block mx-6 text-lg font-bold">Sign Up</span>
              </button>
            </li>
          </ul>
          {showNav && (
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
              className="lg:hidden absolute top-0 end-0 w-4/5 bg-gradient-secondary py-20 z-50 h-full"
            >
              <div className="m-10 flex justify-end">
                <FaXmark size={30} onClick={() => setShowNav(false)} />
              </div>
              <ul className="flex flex-col-reverse lg:hidden">
                <li className="flex text-lg font-extrabold items-center m-10 leading-5">
                  <button
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    type="button"
                    className="flex items-center"
                  >
                    Dark{" "}
                    <span className="block mx-2">
                      <FaChevronDown size={19} />
                    </span>
                  </button>
                  <Menu
                    id="demo-customized-menu"
                    MenuListProps={{
                      "aria-labelledby": "demo-customized-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{
                      "& .MuiPaper-root": {
                        backgroundColor: "black",
                      },
                    }}
                  >
                    <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                      Theme 1
                    </MenuItem>
                    <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                      Theme 2
                    </MenuItem>
                    <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                      Theme 3
                    </MenuItem>
                  </Menu>
                </li>
                <li className="flex text-lg font-extrabold items-center m-10 leading-5">
                  <button type="button">AR</button>
                </li>
                <li>
                  <button
                    className="h-[77px] w-[203px] bg-primary rounded flex items-center p-3 m-10 transition-all duration-300 hover:opacity-60"
                    onClick={() => {
                      setShow(true);
                      setShowNav(false);
                    }}
                    type="button"
                  >
                    <div className="w-[50px] h-[50px] rounded-full bg-[#140C34] flex justify-center items-center">
                      <div className="w-[30px] h-[30px] rounded-full bg-[#D9D9D9] flex justify-center items-center">
                        <FaUser size={22} color="#140C34" />
                      </div>
                    </div>
                    <span className="block mx-6 text-lg font-bold">
                      Sign Up
                    </span>
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </motion.nav>
        <section className="lg:mt-28 mt-10 flex justify-between w-full">
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="w-[434px] hidden lg:block"
          >
            <h1 className="text-4xl leading-10 uppercase font-bold text-primary">
              secsers
            </h1>
            <p className="leading-9 text-2xl font-extrabold">
              We are fame makers{" "}
              <PiSealCheckFill className="inline" size={28} color="#1b9de2" />{" "}
              <br />
              The All-In-One Social Media <br /> Marketing tool you will need!
            </p>
            <div className="w-full flex">
              <div className="w-1/2">
                <h6 className="text-xs font-normal flex items-center my-4">
                  <FaCircleCheck className="m-1" size={10} color="#fff" />{" "}
                  Services are updated daily!
                </h6>
                <h6 className="text-xs font-normal flex items-center my-4">
                  <FaCircleCheck className="m-1" size={10} color="#fff" /> +100
                  Secure payment methods!
                </h6>
                <h6 className="text-xs font-normal flex items-center my-4">
                  <FaCircleCheck className="m-1" size={10} color="#fff" /> 24/7
                  Tech Support for Any help!
                </h6>
              </div>
              <div className="w-1/2">
                <h6 className="text-xs font-normal flex items-center my-4">
                  <FaCircleCheck className="m-1" size={10} color="#fff" /> You
                  can resell our services!
                </h6>
                <h6 className="text-xs font-normal flex items-center my-4">
                  <FaCircleCheck className="m-1" size={10} color="#fff" />{" "}
                  Real/High quality services!
                </h6>
                <h6 className="text-xs font-normal flex items-center my-4">
                  <FaCircleCheck className="m-1" size={10} color="#fff" />{" "}
                  +9258876 orders until now!
                </h6>
              </div>
            </div>
            <h6 className="text-xs font-normal flex items-center my-4">
              #1 Cheapest SMM services starting at only $0.001/k
            </h6>
            <div className="flex mt-16">
              <button className="bg-primary text-base font-semibold rounded px-6 py-4 transition-all duration-300 hover:opacity-60">
                Our Services
              </button>
              <button
                onClick={() => setShow(true)}
                className="bg-transparent text-base font-semibold rounded px-6 py-4 border mx-6 transition-all duration-300 hover:bg-white hover:text-black"
              >
                Sign Up Now
              </button>
            </div>
            <div className="flex mt-20">
              <div className="flex w-1/2">
                <div className="w-[51px] h-12 bg-primary rounded flex items-center justify-center">
                  <FaCrown size={33} />
                </div>
                <div className="mx-6">
                  <p className="font-extrabold text-xl leading-7">{orders}</p>
                  <p className="font-normal text-xs leading-4 opacity-60">
                    Total Orders
                  </p>
                </div>
              </div>
              <div className="flex w-1/2">
                <div className="w-[51px] h-12 bg-primary rounded flex items-center justify-center">
                  <FaRegFaceSmile size={33} />
                </div>
                <div className="mx-6">
                  <p className="font-extrabold text-xl leading-7">{users}</p>
                  <p className="font-normal text-xs leading-4 opacity-60">
                    Active User
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="lg:w-[488px] w-full bg-gradient-secondary rounded-lg shadow-main px-4 lg:px-11 py-8"
          >
            <h2 className="text-3xl font-black leading-8 text-center">
              Sign In
            </h2>
            <p className="text-base font-normal opacity-60 mt-8 text-center">
              Enter your username and password for login.
            </p>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
              className="lg:w-[327px] w-full mx-auto mt-16"
            >
              <div className="relative flex items-center">
                <input
                  type="email"
                  className={`w-full h-[68px] ${
                    formik.errors.email &&
                    formik.touched.email &&
                    "box-border border border-red-600 text-red-600"
                  } rounded-lg bg-input-primary ps-16 pe-6 placeholder:text-xs placeholder:font-bold`}
                  placeholder="Email"
                  {...formik.getFieldProps("email")}
                />
                <div className="w-10 h-10 bg-primary start-3 rounded-md flex justify-center items-center absolute">
                  <FiMail size={25} />
                </div>
              </div>
              {formik.errors.email && formik.touched.email && (
                <div className="my-1 text-red-600 text-xs text-center">
                  {formik.errors.email}
                </div>
              )}
              <div className="relative flex items-center mt-8">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full h-[68px] ${
                    formik.errors.password &&
                    formik.touched.password &&
                    "box-border border border-red-600 text-red-600"
                  } rounded-lg bg-input-primary ps-16 pe-16 placeholder:text-xs placeholder:font-bold`}
                  placeholder="Password"
                  {...formik.getFieldProps("password")}
                />
                <div className="w-10 h-10 bg-primary start-3 rounded-md flex justify-center items-center absolute">
                  <FaUnlockKeyhole size={25} />
                </div>
                {showPassword ? (
                  <FaEyeSlash
                    className="text-primary end-3 absolute cursor-pointer"
                    size={27}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="text-primary end-3 absolute cursor-pointer"
                    size={25}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {formik.errors.password && formik.touched.password && (
                <div className="my-1 text-red-600 text-xs text-center">
                  {formik.errors.password}
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <div>
                  <Checkbox
                    id="box"
                    sx={{
                      color: "#E94B19",
                      "&.Mui-checked": {
                        color: "#E94B19",
                      },
                    }}
                    {...formik.getFieldProps("rememberMe")}
                  />
                  <label
                    htmlFor="box"
                    className="text-xs font-semibold opacity-80 tracking-wider cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>
                <p
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-semibold opacity-80 tracking-wider cursor-pointer transition-all duration-300 hover:text-primary/80 hover:underline"
                >
                  Forgot Password?
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading && "opacity-60"
                } rounded-lg bg-primary w-full transition-all duration-300 hover:opacity-60 text-base font-semibold text-white/80 py-3 mt-6`}
              >
                {loading ? "Signing In..." : " Sign In"}
              </button>
              <button
                onClick={() => setShow(true)}
                className="rounded-lg bg-input-primary w-full transition-all duration-300 hover:opacity-60 text-xs font-semibold text-white/80 py-3 my-4"
              >
                Dont have an account ? Sign Up <br /> Now!
              </button>
            </form>
          </motion.div>
        </section>
      </section>
      {show && (
        <SignUp
          referral={router.query.referral}
          setShow={setShow}
          setCreated={setCreated}
        />
      )}
      {showForgotPassword && (
        <ForgotPassword
          setShowForgotPassword={setShowForgotPassword}
          setShowMessage={setShowMessage}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={created}
        autoHideDuration={6000}
        onClose={() => setCreated(false)}
      >
        <Alert
          onClose={() => setCreated(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          User created successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Password changed successfully!
        </Alert>
      </Snackbar>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    getNextAuthOptions(context.req, context.res)
  );
  connectMongo().catch(() => res.json({ error: "Connection failed" }));
  const users = await User.find({ role: "user" }).count();
  const orders = await Order.find().count();

  if (session) {
    return {
      redirect: {
        destination: session.user.role === "admin" ? "/admin" : "/order",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      users,
      orders,
    },
  };
}
