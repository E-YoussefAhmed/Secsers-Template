import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Footer = () => {
  const router = useRouter();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "tween" }}
      className={`${
        router.pathname === "/" ? "hidden" : "block"
      } absolute left-0 bottom-0 w-full z-10`}
    >
      <div className="text-center text-sm lg:text-base p-4 bg-gradient-secondary tracking-wider">
        2023 &copy;{" "}
        <a
          href="https://devlab-tech.com"
          target="_blank"
          className="text-primary"
        >
          DevLab
        </a>
        , All Right Reserved
      </div>
    </motion.footer>
  );
};

export default Footer;
