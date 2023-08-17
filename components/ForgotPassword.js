import React, { useState } from "react";
import { FaXmark, FaLock } from "react-icons/fa6";
import { useFormik } from "formik";
import { motion } from "framer-motion";

const ForgotPassword = ({ setShowForgotPassword, setShowMessage }) => {
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      tempPassword: "",
      newPassword: "",
      cPassword: "",
    },
    validate,
    onSubmit,
  });

  async function validate(values) {
    const errors = {};
    if (!values.tempPassword) {
      errors.tempPassword = "Required";
    } else if (values.tempPassword.includes(" ")) {
      errors.tempPassword = "Invalid Password";
    }

    if (!values.newPassword) {
      errors.newPassword = "Required";
    } else if (
      values.newPassword.length < 8 ||
      values.newPassword.length > 20
    ) {
      errors.newPassword = "Must be greater than 8 and less than 20";
    } else if (values.newPassword.includes(" ")) {
      errors.newPassword = "Invalid Password";
    }

    if (!values.cPassword) {
      errors.cPassword = "Required";
    } else if (values.cPassword !== values.newPassword) {
      errors.cPassword = "Password doesn't match";
    }
    return errors;
  }

  async function onSubmit(values) {
    setLoadingPassword(true);
    const status = await fetch("/api/confirmpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempPass: values.tempPassword,
        newPass: values.newPassword,
        email,
      }),
    });
    const data = await status.json();
    if (status.ok) {
      setShowMessage(true);
      setShowForgotPassword(false);
      console.log("changed");
    } else {
      console.log(data.error);
      formik.errors.tempPassword = data.error;
    }
    setLoadingPassword(false);
  }

  const handleSubmit = async () => {
    setLoadingEmail(true);
    const res = await fetch("/api/forgotpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setShow(true);
      setMessage(data.message);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage(data.message);
      setTimeout(() => setMessage(null), 3000);
    }
    setLoadingEmail(false);
  };

  return (
    <div className="absolute z-20 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "tween" }}
        className="w-[440px] bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col items-center p-6"
      >
        <FaLock size={74} color="E94B19" className="mb-4" />
        <div className="w-[272px]">
          <input
            type="text"
            value={email}
            disabled={show}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
            placeholder="Your Email"
          />
        </div>
        <button
          type="submit"
          disabled={loadingEmail || show}
          onClick={handleSubmit}
          className={`w-[105px] py-2 bg-primary hover:opacity-60 transition-opacity duration-300 font-bold text-base rounded-full m-2 ${
            (loadingEmail || show) && "opacity-60"
          }`}
        >
          {loadingEmail ? "Submitting" : "Confirm"}
        </button>
        {message && (
          <div className="text-red-600 my-2 text-xs text-center">{message}</div>
        )}
        {show && (
          <form
            noValidate
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center"
          >
            <div className="w-[272px]">
              <input
                type="password"
                {...formik.getFieldProps("tempPassword")}
                className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
                placeholder="Password"
              />
            </div>
            {formik.errors.tempPassword && formik.touched.tempPassword && (
              <div className="text-red-600 text-xs text-center">
                {formik.errors.tempPassword}
              </div>
            )}
            <div className="w-[272px]">
              <input
                type="password"
                {...formik.getFieldProps("newPassword")}
                className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
                placeholder="Password"
              />
            </div>
            {formik.errors.newPassword && formik.touched.newPassword && (
              <div className="text-red-600 text-xs text-center">
                {formik.errors.newPassword}
              </div>
            )}
            <div className="w-[272px]">
              <input
                type="password"
                {...formik.getFieldProps("cPassword")}
                className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
                placeholder="Password"
              />
            </div>
            {formik.errors.cPassword && formik.touched.cPassword && (
              <div className="text-red-600 text-xs text-center">
                {formik.errors.cPassword}
              </div>
            )}
            <button
              type="submit"
              disabled={loadingPassword}
              className={`w-[105px] py-2 bg-primary font-bold hover:opacity-60 transition-opacity duration-300 text-base rounded-full m-2 ${
                loadingPassword && "opacity-60"
              }`}
            >
              {loadingPassword ? "Submitting" : "Confirm"}
            </button>
          </form>
        )}

        <FaXmark
          className="absolute top-6 end-6 cursor-pointer"
          onClick={() => setShowForgotPassword(false)}
          size={22}
        />
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
