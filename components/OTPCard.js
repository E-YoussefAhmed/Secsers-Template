import useCountdown from "@hooks/useCountdown";
import React, { useEffect, useState } from "react";
import { FaXmark, FaEnvelopeCircleCheck } from "react-icons/fa6";
import { motion } from "framer-motion";

const OTPCard = ({ setShowVerify, setShowVerityMessage, session, update }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newError, setNewError] = useState(null);
  const [counter, setCounter] = useState(false);
  const { minsLeft, secondsLeft, startMins, startSeconds } = useCountdown();
  const [OTP, setOTP] = useState({
    firstChar: "",
    secondChar: "",
    thirdChar: "",
    fourthChar: "",
    fifthChar: "",
  });

  useEffect(() => {
    const sendCode = async () => {
      const response = await fetch("/api/verification");
      const data = await response.json();
    };
    sendCode();
  }, []);

  const handleChange = (e) => {
    // const inputs = document.querySelectorAll(".verification");
    const currentInput = e.target;
    const nextInput = e.target.nextElementSibling;
    const prevInput = e.target.previousElementSibling;
    // console.log(currentInput, nextInput, prevInput);

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }

    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }
    if (nextInput && currentInput.value !== "") {
      nextInput.focus();
      nextInput.value = "";
    }

    if (e.key === "Backspace" && currentInput.value === "") {
      if ((nextInput && nextInput.value === "") || !nextInput) {
        if (prevInput) {
          // prevInput.value = "";
          prevInput.focus();
          currentInput.setAttribute("disabled", "true");
        }
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const finalOTP = `${OTP.firstChar}${OTP.secondChar}${OTP.thirdChar}${OTP.fourthChar}${OTP.fifthChar}`;
    const res = await fetch("/api/verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: finalOTP }),
    });
    const data = await res.json();
    if (res.ok) {
      await update({
        ...session,
        user: {
          ...session.user,
          verified: data.verified,
        },
      });
      setShowVerityMessage(true);
      setShowVerify(false);
    } else {
      setError(data.error);
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  const newCode = async () => {
    setLoading(true);
    const res = await fetch("/api/verification", {
      method: "PUT",
    });
    const data = await res.json();
    if (res.ok) {
      startMins(3);
      startSeconds(0);
      setCounter(true);
      setNewError(data.message);
      setTimeout(() => setNewError(null), 3000);
    } else {
      startMins(new Date(new Date(data.expireAt) - Date.now()).getMinutes());
      startSeconds(new Date(new Date(data.expireAt) - Date.now()).getSeconds());
      setCounter(true);
    }
    setLoading(false);
  };

  return (
    <div className="absolute z-20 px-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "tween" }}
        className="w-[440px] bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col items-center p-6"
      >
        <FaEnvelopeCircleCheck size={74} color="E94B19" />
        <div>
          <p className="font-bold sm:text-2xl text-center mt-7">
            A Verification Code been sent
          </p>
          <p className="font-bold sm:text-2xl text-center">
            to your email address
          </p>
        </div>
        <p className="mt-14 text-base font-normal mb-3">Enter The Code</p>
        <div className="flex justify-between w-[300px]">
          <input
            type="text"
            className="w-[50px] h-[38px] bg-input-secondary rounded-lg p-4 text-2xl text-center verification"
            onKeyUp={handleChange}
            value={OTP.firstChar}
            onChange={(e) => setOTP({ ...OTP, firstChar: e.target.value })}
            autoFocus
          />
          <input
            type="text"
            className="w-[50px] h-[38px] bg-input-secondary rounded-lg p-4 text-2xl text-center verification"
            onKeyUp={handleChange}
            value={OTP.secondChar}
            onChange={(e) => setOTP({ ...OTP, secondChar: e.target.value })}
            disabled
          />
          <input
            type="text"
            className="w-[50px] h-[38px] bg-input-secondary rounded-lg p-4 text-2xl text-center verification"
            onKeyUp={handleChange}
            value={OTP.thirdChar}
            onChange={(e) => setOTP({ ...OTP, thirdChar: e.target.value })}
            disabled
          />
          <input
            type="text"
            className="w-[50px] h-[38px] bg-input-secondary rounded-lg p-4 text-2xl text-center verification"
            onKeyUp={handleChange}
            value={OTP.fourthChar}
            onChange={(e) => setOTP({ ...OTP, fourthChar: e.target.value })}
            disabled
          />
          <input
            type="text"
            className="w-[50px] h-[38px] bg-input-secondary rounded-lg p-4 text-2xl text-center verification"
            onKeyUp={handleChange}
            value={OTP.fifthChar}
            onChange={(e) => setOTP({ ...OTP, fifthChar: e.target.value })}
            disabled
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={
            OTP.firstChar === "" ||
            OTP.secondChar === "" ||
            OTP.thirdChar === "" ||
            OTP.fourthChar === "" ||
            OTP.fifthChar === "" ||
            loading
          }
          className={`w-[105px] py-2 bg-primary font-bold hover:opacity-60 transition-opacity duration-300 text-base rounded-full mx-2 mt-7 ${
            OTP.firstChar === "" ||
            OTP.secondChar === "" ||
            OTP.thirdChar === "" ||
            OTP.fourthChar === "" ||
            OTP.fifthChar === ""
              ? "opacity-60"
              : ""
          } ${loading ? "opacity-60" : ""}`}
        >
          Confirm
        </button>
        {error && (
          <div className="text-red-600 text-xs text-center">{error}</div>
        )}
        <button
          onClick={newCode}
          disabled={loading || secondsLeft || minsLeft}
          className={`w-fit p-2 bg-primary font-bold hover:opacity-60 transition-opacity duration-300 text-base rounded-full mx-2 mt-4 ${
            loading || secondsLeft || minsLeft ? "opacity-60" : ""
          }`}
        >
          Send New Code
        </button>
        {counter && (
          <div className="text-red-600 my-2 text-xs text-center">
            {minsLeft || secondsLeft
              ? `You can send another code after ${minsLeft}:${
                  secondsLeft >= 10 ? secondsLeft : `0${secondsLeft}`
                }`
              : "You can send another code"}
          </div>
        )}
        {newError && (
          <div className="text-red-600 text-xs text-center">{newError}</div>
        )}

        <FaXmark
          className="absolute top-6 end-6 cursor-pointer"
          onClick={() => setShowVerify(false)}
          size={22}
        />
      </motion.div>
    </div>
  );
};

export default OTPCard;
