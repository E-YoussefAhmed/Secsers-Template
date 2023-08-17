import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaXmark,
  FaRegUser,
  FaLock,
  FaUserGroup,
} from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import { motion } from "framer-motion";

const SignUp = ({ referral, setShow, setCreated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      cPassword: "",
      referralCode: referral ? referral : "",
      readTerms: false,
    },
    validate,
    onSubmit,
  });

  async function validate(values) {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = "Required";
    } else if (values.firstName.includes(" ")) {
      errors.firstName = "Name can't contain spaces";
    } else if (values.firstName.length < 3 || values.firstName.length > 10) {
      errors.firstName = "Name must be between 3 and 10 chars";
    }

    if (
      (values.lastName && values.lastName.length < 3) ||
      values.lastName.length > 10
    ) {
      errors.lastName = "Name must be between 3 and 10 chars";
    } else if (values.lastName.includes(" ")) {
      errors.lastName = "Name can't contain spaces";
    }

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

    if (!values.cPassword) {
      errors.cPassword = "Required";
    } else if (values.password !== values.cPassword) {
      errors.cPassword = "Password does't match!";
    }

    if (!values.readTerms) {
      errors.readTerms = "You have to accept our terms!";
    }

    return errors;
  }

  async function onSubmit(values) {
    // console.log(values);
    setLoading(true);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${values.firstName}${
          values.lastName ? ` ${values.lastName}` : ""
        }`,
        email: values.email,
        password: values.password,
        referralCode: values.referralCode ? values.referralCode : null,
      }),
    });

    if (response.ok) {
      setCreated(true);
      setShow(false);
    } else {
      const data = await response.json();
      if (data.email) {
        formik.errors.email = data.message;
      } else if (data.referral) {
        formik.errors.referralCode = data.message;
      }
    }
    setLoading(false);
  }

  return (
    <div className="absolute z-20 p-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-start sm:items-center overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "tween" }}
        className="sm:w-[446px] w-full bg-gradient-secondary rounded-lg relative shadow-main pt-8 px-9 pb-14"
      >
        <h2 className="font-extrabold text-xl">Create an account</h2>
        <p className="font-semibold text-xs opacity-60 mt-2">
          Create an account by fill up this form.
        </p>
        <form
          className="mt-14 w-11/12 sm:w-[327px] mx-auto"
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <div className="relative flex items-center my-2">
            <input
              type="text"
              className={`w-full h-[68px] ${
                formik.errors.firstName &&
                formik.touched.firstName &&
                "box-border border border-red-600 text-red-600"
              } rounded-lg bg-input-primary ps-16 pe-6 placeholder:text-xs placeholder:font-bold`}
              placeholder="First Name"
              {...formik.getFieldProps("firstName")}
            />
            <div className="w-10 h-10 bg-primary start-3 rounded-md flex justify-center items-center absolute">
              <FaRegUser size={19} />
            </div>
          </div>
          {formik.errors.firstName && formik.touched.firstName && (
            <div className="my-1 text-red-600 text-xs text-center">
              {formik.errors.firstName}
            </div>
          )}
          <div className="relative flex items-center my-2">
            <input
              type="text"
              className={`w-full h-[68px] ${
                formik.errors.lastName &&
                formik.touched.lastName &&
                "box-border border border-red-600 text-red-600"
              } rounded-lg bg-input-primary ps-16 pe-6 placeholder:text-xs placeholder:font-bold`}
              placeholder="Last Name"
              {...formik.getFieldProps("lastName")}
            />
            <div className="w-10 h-10 bg-primary start-3 rounded-md flex justify-center items-center absolute">
              <FaRegUser size={19} />
            </div>
          </div>
          {formik.errors.lastName && formik.touched.lastName && (
            <div className="my-1 text-red-600 text-xs text-center">
              {formik.errors.lastName}
            </div>
          )}
          <div className="relative flex items-center my-2">
            <input
              type="email"
              className={`w-full h-[68px] ${
                formik.errors.email &&
                formik.touched.email &&
                "box-border border border-red-600 text-red-600"
              } rounded-lg bg-input-primary ps-16 pe-6 placeholder:text-xs placeholder:font-bold`}
              placeholder="Email Address"
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
          <div className="relative flex items-center my-2">
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
              <FaLock size={25} />
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
          <div className="relative flex items-center my-2">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full h-[68px] ${
                formik.errors.cPassword &&
                formik.touched.cPassword &&
                "box-border border border-red-600 text-red-600"
              } rounded-lg bg-input-primary ps-16 pe-16 placeholder:text-xs placeholder:font-bold`}
              placeholder="Confirm Password"
              {...formik.getFieldProps("cPassword")}
            />
            <div className="w-10 h-10 bg-primary start-3 rounded-md flex justify-center items-center absolute">
              <FaLock size={25} />
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
          {formik.errors.cPassword && formik.touched.cPassword && (
            <div className="my-1 text-red-600 text-xs text-center">
              {formik.errors.cPassword}
            </div>
          )}
          <div className="relative flex items-center my-2">
            <input
              type="text"
              className={`w-full h-[68px] ${
                formik.errors.referralCode &&
                formik.touched.referralCode &&
                "box-border border border-red-600 text-red-600"
              } rounded-lg bg-input-primary ps-16 pe-6 placeholder:text-xs placeholder:font-bold`}
              placeholder="Referral Code (Optional)"
              {...formik.getFieldProps("referralCode")}
            />
            <div className="w-10 h-10 bg-primary start-3 rounded-md flex justify-center items-center absolute">
              <FaUserGroup size={25} />
            </div>
          </div>
          {formik.errors.referralCode && formik.touched.referralCode && (
            <div className="my-1 text-red-600 text-xs text-center">
              {formik.errors.referralCode}
            </div>
          )}
          <div className="">
            <Checkbox
              id="box2"
              sx={{
                color: formik.errors.readTerms ? "#7f1d1d" : "#E94B19",
                "&.Mui-checked": {
                  color: "#E94B19",
                },
              }}
              {...formik.getFieldProps("readTerms")}
              // onChange={(e) => console.log(e.target.checked)}
            />
            <label
              htmlFor="box2"
              className="text-xs font-semibold cursor-pointer"
            >
              I have read the terms....
            </label>
          </div>
          {formik.errors.readTerms && formik.touched.readTerms && (
            <div className="my-1 text-red-600 text-xs text-center">
              {formik.errors.readTerms}
            </div>
          )}
          <button
            disabled={loading}
            className={`w-[192px] py-3 text-sm transition-all duration-300 hover:opacity-60 font-semibold bg-primary rounded-lg mx-auto block ${
              loading && "opacity-60"
            }`}
          >
            {loading ? "Loading..." : "Create Account"}
          </button>
          <p
            onClick={() => setShow(false)}
            className="text-center text-sm font-medium mt-2 transition-colors duration-300 opacity-60 hover:underline hover:text-primary cursor-pointer"
          >
            Already Have an Account?
          </p>
        </form>
        <FaXmark
          className="absolute top-6 end-6 cursor-pointer"
          onClick={() => setShow(false)}
          size={22}
        />
      </motion.div>
    </div>
  );
};

export default SignUp;
