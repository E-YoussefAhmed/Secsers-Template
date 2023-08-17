import React, { useState } from "react";
import { FaXmark, FaClipboardCheck } from "react-icons/fa6";
import { useFormik } from "formik";
import { motion } from "framer-motion";

const ChangeEmail = ({
  setShowChangeEmail,
  update,
  session,
  setShowEmailMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit,
  });

  async function validate(values) {
    const errors = {};
    if (!session.user.verified) {
      errors.email = "Please verify your email before changing it";
    } else if (!values.email) {
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
    const status = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });
    const data = await status.json();
    if (status.ok) {
      await update({
        ...session,
        user: {
          ...session.user,
          email: values.email,
          verified: false,
        },
      });
      setShowEmailMessage(true);
      setShowChangeEmail(false);
    } else {
      console.log(data.error);
      formik.errors.password = data.error;
    }
    setLoading(false);
  }
  return (
    <div className="absolute z-20 px-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
      <motion.form
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "tween" }}
        noValidate
        onSubmit={formik.handleSubmit}
        className="w-[440px] bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col items-center p-6"
      >
        <FaClipboardCheck size={74} color="E94B19" className="mb-4" />
        <div className="w-[272px]">
          <input
            type="text"
            {...formik.getFieldProps("email")}
            className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
            placeholder="New Email"
          />
        </div>
        {formik.errors.email && formik.touched.email && (
          <div className="text-red-600 text-xs text-center">
            {formik.errors.email}
          </div>
        )}
        <div className="w-[272px]">
          <input
            type="password"
            {...formik.getFieldProps("password")}
            className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
            placeholder="Password"
          />
        </div>
        {formik.errors.password && formik.touched.password && (
          <div className="text-red-600 text-xs text-center">
            {formik.errors.password}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-[105px] py-2 bg-primary hover:opacity-60 transition-opacity duration-300 font-bold text-base rounded-full m-2 ${
            loading && "opacity-60"
          }`}
        >
          {loading ? "Submitting" : "Confirm"}
        </button>

        <FaXmark
          className="absolute top-6 end-6 cursor-pointer"
          onClick={() => setShowChangeEmail(false)}
          size={22}
        />
      </motion.form>
    </div>
  );
};

export default ChangeEmail;
