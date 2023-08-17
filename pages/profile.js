import React, { useEffect, useState } from "react";
import ChangeEmail from "@components/ChangeEmail";
import ChangeName from "@components/ChangeName";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { FaUser, FaPenToSquare } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Tooltip } from "antd";
import { FaCheckCircle } from "react-icons/fa";
import OTPCard from "@components/OTPCard";
import { motion } from "framer-motion";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// import OtpInput from "otp-input-react";

const Profile = () => {
  const { data: session, status, update } = useSession();
  const [spending, setSpending] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const [showNameMessage, setShowNameMessage] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [showVerityMessage, setShowVerityMessage] = useState(false);
  const [showSpendingMessage, setShowSpendingMessage] = useState(false);

  useEffect(() => {
    const getSpending = async () => {
      const res = await fetch("/api/spending");
      const data = await res.json();
      if (res.ok) {
        setSpending(data.actualSpending);
      }
    };
    getSpending();
  }, []);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      cPassword: "",
    },
    validate,
    onSubmit,
  });

  async function validate(values) {
    const errors = {};
    if (!session.user.verified) {
      errors.oldPassword = "Please verify your email first";
    } else if (!values.oldPassword) {
      errors.oldPassword = "Required";
    } else if (
      values.oldPassword.length < 8 ||
      values.oldPassword.length > 20
    ) {
      errors.oldPassword = "Must be greater than 8 and less than 20";
    } else if (values.oldPassword.includes(" ")) {
      errors.oldPassword = "Invalid Password";
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
    setLoading(true);
    const status = await fetch("/api/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    });
    const data = await status.json();
    if (status.ok) {
      setShowPasswordMessage(true);
      values.oldPassword = "";
      values.newPassword = "";
      values.cPassword = "";
    } else {
      console.log(data.error);
      formik.errors.oldPassword = data.error;
    }
    setLoading(false);
  }

  const handleBalance = async () => {
    setLoadingBalance(true);
    const res = await fetch("/api/spending", {
      method: "PUT",
    });
    const data = await res.json();
    if (res.ok) {
      await update({
        ...session,
        user: {
          ...session.user,
          balance: data.newBalance,
          spending: data.newSpending,
        },
      });
      setShowSpendingMessage(true);
    }
    setLoadingBalance(false);
  };

  return (
    <section className="flex  items-center flex-1 flex-col lg:pb-60 pb-44 overflow-y-auto overflow-x-hidden pt-10 lg:pt-28 px-10">
      <div className="w-full flex flex-col lg:flex-row justify-evenly">
        {status === "authenticated" ? (
          <>
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
              className="xl:w-[526px]"
            >
              <div className="flex items-end md:justify-center">
                <FaUser className="mx-6" size={72} color="E94B19" />
                <p className="xl:text-5xl lg:text-3xl md:text-5xl text-2xl font-bold">
                  {session.user.name}
                </p>
                <FaPenToSquare
                  onClick={() => setShowChangeName(true)}
                  className="mx-3 cursor-pointer"
                  size={24}
                />
              </div>
              <div className="lg:mt-20 mt-4">
                <p className="md:text-2xl font-semibold">ID</p>
                <input
                  type="text"
                  readOnly
                  className="mt-2 bg-input-secondary w-full h-[50px] rounded-lg border-b md:text-2xl font-normal py-3 px-7"
                  value={session.user.id}
                />
              </div>
              <div className="lg:mt-16 mt-4 relative">
                <p className="md:text-2xl font-semibold">Email</p>
                <input
                  type="text"
                  readOnly
                  className="mt-2 bg-input-secondary w-full h-[50px] rounded-lg border-b md:text-2xl font-normal py-3 px-7"
                  value={session.user.email}
                />
                <FaPenToSquare
                  className="absolute end-6 top-14 cursor-pointer"
                  onClick={() => setShowChangeEmail(true)}
                  size={22}
                />
                {session.user.verified ? (
                  <p className="font-normal text-lg text-completed opacity-60 text-end mt-3">
                    Verified
                    <FaCheckCircle
                      className="inline-block mx-2"
                      color="#32C21A"
                    />
                  </p>
                ) : (
                  <p
                    className="font-normal text-lg opacity-60 text-end mt-3 cursor-pointer"
                    onClick={() => setShowVerify(true)}
                  >
                    Verify Your Email Address
                    <Tooltip
                      title="Your won't be able to change your email or password or do forgot password method until you verify your email!"
                      color="#E94B19"
                    >
                      <BsExclamationCircle className="inline-block mx-2" />
                    </Tooltip>
                  </p>
                )}
              </div>
              <div className="w-full py-6 bg-gradient-secondary rounded-lg shadow-main my-4">
                <div className="flex mt-6 justify-around items-center w-full">
                  <p className="font-semibold md:text-2xl">Spending:</p>
                  <p className="font-semibold md:text-3xl">
                    ${session.user.spending}
                  </p>
                </div>
                {Boolean(spending) && (
                  <div className="flex mt-6 justify-around items-center w-full">
                    <p className="font-semibold md:text-2xl">Actual:</p>
                    <p className="font-semibold md:text-3xl">${spending}</p>
                  </div>
                )}
                <button
                  onClick={handleBalance}
                  disabled={
                    session.user.spending === spending || loadingBalance
                  }
                  className={`px-10 py-2 bg-primary hover:opacity-60 transition-opacity duration-300 cursor-pointer block mx-auto font-bold text-base rounded-full mt-5 ${
                    loadingBalance && "opacity-60"
                  }`}
                >
                  {loadingBalance ? "Sending..." : "Send Request"}
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
              className="xl:w-[440px] lg:w-[300px]"
            >
              <div className="w-full py-6 bg-gradient-secondary rounded-lg shadow-main">
                <div className="flex justify-around items-center w-full">
                  <p className="font-semibold md:text-2xl">Balance:</p>
                  <p className="font-semibold md:text-3xl">
                    ${session.user.balance}
                  </p>
                </div>
              </div>
              <form
                noValidate
                onSubmit={formik.handleSubmit}
                className="w-full lg:mt-24 mt-10 flex flex-col items-center bg-gradient-secondary rounded-lg shadow-main py-10 px-4"
              >
                <p className="md:text-2xl text-lg font-medium">
                  Change Your Password
                </p>
                <div className="xl:w-[314px] w-full mt-11">
                  <input
                    type="password"
                    className="w-full h-[47px] bg-input-secondary rounded-lg placeholder:text-sm font-medium py-3 px-4"
                    placeholder="Current Password"
                    {...formik.getFieldProps("oldPassword")}
                  />
                </div>
                {formik.errors.oldPassword && formik.touched.oldPassword && (
                  <div className="text-red-600 text-xs text-center">
                    {formik.errors.oldPassword}
                  </div>
                )}
                <div className="xl:w-[314px] w-full mt-10">
                  <input
                    type="password"
                    className="w-full h-[47px] bg-input-secondary rounded-lg placeholder:text-sm font-medium py-3 px-4"
                    placeholder="New Password"
                    {...formik.getFieldProps("newPassword")}
                  />
                </div>
                {formik.errors.newPassword && formik.touched.newPassword && (
                  <div className="text-red-600 text-xs text-center">
                    {formik.errors.newPassword}
                  </div>
                )}
                <div className="xl:w-[314px] w-full mt-10">
                  <input
                    type="password"
                    className="w-full h-[47px] bg-input-secondary rounded-lg placeholder:text-sm font-medium py-3 px-4"
                    placeholder="Confirm Password"
                    {...formik.getFieldProps("cPassword")}
                  />
                </div>
                {formik.errors.cPassword && formik.touched.cPassword && (
                  <div className="text-red-600 text-xs text-center">
                    {formik.errors.cPassword}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-2 bg-primary hover:opacity-60 transition-opacity duration-300 font-bold text-base rounded-full mx-2 mt-5"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </>
        ) : (
          <div className="text-4xl font-bold flex justify-center items-center">
            Loading...
          </div>
        )}
      </div>
      {showChangeEmail && (
        <ChangeEmail
          setShowChangeEmail={setShowChangeEmail}
          update={update}
          session={session}
          setShowEmailMessage={setShowEmailMessage}
        />
      )}
      {showChangeName && (
        <ChangeName
          setShowChangeName={setShowChangeName}
          update={update}
          session={session}
          setShowNameMessage={setShowNameMessage}
        />
      )}
      {showVerify && (
        <OTPCard
          setShowVerify={setShowVerify}
          setShowVerityMessage={setShowVerityMessage}
          update={update}
          session={session}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showNameMessage}
        autoHideDuration={6000}
        onClose={() => setShowNameMessage(false)}
      >
        <Alert
          onClose={() => setShowNameMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Name Changed Successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showEmailMessage}
        autoHideDuration={6000}
        onClose={() => setShowEmailMessage(false)}
      >
        <Alert
          onClose={() => setShowEmailMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Email Changed Successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showPasswordMessage}
        autoHideDuration={6000}
        onClose={() => setShowPasswordMessage(false)}
      >
        <Alert
          onClose={() => setShowPasswordMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Password Changed Successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showVerityMessage}
        autoHideDuration={6000}
        onClose={() => setShowVerityMessage(false)}
      >
        <Alert
          onClose={() => setShowVerityMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Email Verified Successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSpendingMessage}
        autoHideDuration={6000}
        onClose={() => setShowSpendingMessage(false)}
      >
        <Alert
          onClose={() => setShowSpendingMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Balance Updated Successfully!
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Profile;
