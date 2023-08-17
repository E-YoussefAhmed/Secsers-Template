import React from "react";
import { useState } from "react";
import {
  FaCircleExclamation,
  FaUser,
  FaWallet,
  FaXmark,
} from "react-icons/fa6";
import { motion } from "framer-motion";

const UserCard = ({
  activeUser,
  setActiveUser,
  setShow,
  setShowBalance,
  setShowDeleted,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [error, setError] = useState(false);
  const [balance, setBalance] = useState("");

  const handleDelete = async () => {
    setShowDelete(false);
    const res = await fetch(`/api/admin`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: activeUser._id }),
    });
    if (res.ok) {
      setShow(false);
      setShowDeleted(true);
      setActiveUser(null);
    }
  };

  const handleChange = async () => {
    if (!Number.isInteger(+balance)) {
      setError("Please enter a valid number");
      return;
    }
    setShowChange(false);
    const res = await fetch(`/api/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: activeUser._id,
        balance,
        userId: activeUser.userId,
      }),
    });
    console.log(await res.json());
    if (res.ok) {
      setShow(false);
      setShowBalance(true);
      setActiveUser(null);
    }
  };

  return (
    <div className="absolute z-20 px-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "tween" }}
        className="md:w-[650px] w-full bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col items-center p-8"
      >
        <div className="font-bold md:text-4xl text-lg mb-4 md:mb-12">
          <FaUser size={50} color="E94B19" className="mx-2 inline-block" />
          {activeUser.name}
        </div>
        <div className="w-full flex flex-col md:flex-row justify-evenly items-center mb-4 md:mb-8">
          <div className="md:w-[344px] h-16 p-6 md:px-0 bg-gradient-secondary mb-2 md:mb-0 flex justify-around items-center rounded-lg shadow-main">
            <p className="font-semibold md:text-2xl">Balance:</p>
            <p className="font-semibold md:text-3xl">${activeUser.balance}</p>
          </div>
          <button
            onClick={() => setShowChange(true)}
            className="font-semibold text-lg opacity-60 hover:text-primary transition-colors duration-300"
          >
            Add
          </button>
        </div>
        <div className="md:w-[280px]">
          <div className="mb-6">
            <p className="text-lg font-semibold">ID</p>
            <input
              type="text"
              readOnly
              className="mt-1 bg-input-secondary tracking-wider w-full h-[28px] rounded-lg border-b text-sm font-normal py-1 px-4"
              value={activeUser.userId}
            />
          </div>
        </div>
        <div className="md:w-[280px]">
          <div className="mb-6">
            <p className="text-lg font-semibold">Email</p>
            <input
              type="text"
              readOnly
              className="mt-1 bg-input-secondary tracking-wider w-full h-[28px] rounded-lg border-b text-sm font-normal py-1 px-4"
              value={activeUser.email}
            />
          </div>
        </div>
        <div className="md:w-[280px]">
          <div className="mb-16">
            <p className="text-lg font-semibold">Referral Code</p>
            <input
              type="text"
              readOnly
              className="mt-1 bg-input-secondary tracking-wider w-full h-[28px] rounded-lg border-b text-sm font-normal py-1 px-4"
              value={activeUser.referralCode}
            />
          </div>
        </div>

        <FaXmark
          className="absolute top-6 end-6 cursor-pointer"
          onClick={() => setShow(false)}
          size={22}
        />
        <button
          onClick={() => setShowDelete(true)}
          className="absolute bottom-3 end-6 text-sm font-normal opacity-60 tracking-wider hover:text-primary transition-colors duration-300"
        >
          Delete User
        </button>
      </motion.div>
      {showDelete && (
        <div className="absolute z-50 px-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="w-[505px] bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col justify-around items-center p-6"
          >
            <FaCircleExclamation size={70} color="#E94B19" />
            <div>
              <p className="font-bold md:text-2xl text-lg text-center my-10">
                Do you want to Delete This User?
              </p>
            </div>
            <div>
              <button
                onClick={() => setShowDelete(false)}
                className="sm:w-[188px] px-4 py-2 bg-transparent font-bold sm:text-2xl rounded-full border mx-2 hover:bg-white hover:text-black transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="sm:w-[188px] px-4 py-2 bg-primary font-bold sm:text-2xl rounded-full mx-2 hover:opacity-60 transition-opacity duration-300"
              >
                Delete
              </button>
            </div>

            <FaXmark
              className="absolute top-6 end-6 cursor-pointer"
              onClick={() => setShowDelete(false)}
              size={22}
            />
          </motion.div>
        </div>
      )}
      {showChange && (
        <div className="absolute z-50 px-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="w-[505px] bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col justify-around items-center p-6"
          >
            <FaWallet size={70} color="#E94B19" />
            <div className="w-[272px] my-4">
              <input
                type="text"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full h-[38px] bg-input-secondary rounded-lg placeholder:text-xs font-medium py-3 px-4 my-2"
                placeholder="Add Funds"
              />
            </div>
            <div className="text-red-600 text-xs text-center">{error}</div>
            <button
              type="submit"
              onClick={handleChange}
              className={`w-[105px] py-2 bg-primary font-bold text-base rounded-full m-2 hover:opacity-60 transition-opacity duration-300`}
            >
              Submit
            </button>

            <FaXmark
              className="absolute top-6 end-6 cursor-pointer"
              onClick={() => setShowChange(false)}
              size={22}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
