import React, { useState } from "react";
import { FaXmark, FaClipboardCheck } from "react-icons/fa6";
import { useFormik } from "formik";
import { motion } from "framer-motion";

const ChangeName = ({
  setShowChangeName,
  update,
  session,
  setShowNameMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    validate,
    onSubmit,
  });

  async function validate(values) {
    const errors = {};

    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length > 15 || values.name.length < 3) {
      errors.name = "Name must be between 3 and 15 chars";
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
    const status = await fetch("/api/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        password: values.password,
      }),
    });
    const data = await status.json();
    if (status.ok) {
      await update({
        ...session,
        user: {
          ...session.user,
          name: values.name,
        },
      });
      setShowNameMessage(true);
      setShowChangeName(false);
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
            {...formik.getFieldProps("name")}
            className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
            placeholder="New Name"
          />
        </div>
        {formik.errors.name && formik.touched.name && (
          <div className="text-red-600 text-xs text-center">
            {formik.errors.name}
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
          onClick={() => setShowChangeName(false)}
          size={22}
        />
      </motion.form>
    </div>
  );
};

export default ChangeName;
