import React from "react";
import { FaArrowDownLong, FaWallet, FaWhatsapp } from "react-icons/fa6";
import { motion } from "framer-motion";

const parentVariants = {
  hide: {},
  show: {
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const variants = {
  hide: {
    opacity: 0,
    y: 100,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

const Funds = () => {
  return (
    <motion.section
      variants={parentVariants}
      initial="hide"
      animate="show"
      className="flex items-center flex-1 flex-col overflow-y-auto pt-28 pb-44
      lg:pb-60 px-10 text-center"
    >
      <motion.h1
        variants={variants}
        className="flex items-center uppercase font-bold text-4xl lg:text-6xl"
      >
        <FaWallet className="mx-7" size={74} color="#E94B19" />
        HOW TO ADD FUNDS
      </motion.h1>
      <motion.h2
        variants={variants}
        className="lg:text-5xl text-3xl font-bold mt-28"
      >
        Send The Amount to This Number
      </motion.h2>
      <motion.h2
        variants={variants}
        className="lg:text-5xl text-3xl font-bold text-primary my-3"
      >
        +20 123 456 7890
      </motion.h2>
      <motion.h2 variants={variants} className="lg:text-5xl text-3xl font-bold">
        Via Vodafone Cash
      </motion.h2>
      <motion.h3
        variants={variants}
        className="lg:text-[40px] text-2xl font-bold mt-14"
      >
        Then Contact Our Admin With Your{" "}
        <span className="text-primary">ID</span>&
        <span className="text-primary">Screenshot</span>
      </motion.h3>
      <motion.div variants={variants}>
        <FaArrowDownLong className="my-4" size={93} />
      </motion.div>
      <motion.button
        variants={variants}
        className="lg:py-6 lg:px-7 p-3 rounded-full bg-primary lg:text-[40px] text-2xl font-bold flex items-center ps-10"
      >
        Whatsapp
        <FaWhatsapp size={64} color="black" className="mx-6" />
      </motion.button>
    </motion.section>
  );
};

export default Funds;
