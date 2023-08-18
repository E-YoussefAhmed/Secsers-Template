import React from "react";
import { useRouter } from "next/router";
import { FaHistory } from "react-icons/fa";
import { FaUserGroup, FaWallet, FaBagShopping } from "react-icons/fa6";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const SideNav = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <>
      {status === "authenticated" && (
        <motion.aside
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "tween" }}
          className={`lg:w-[138px] w-full lg:h-full bg-sidebar px-1 ${
            router.pathname === "/" ? "hidden" : "block"
          } ${session?.user.role === "admin" ? "hidden" : "block"}`}
        >
          <ul className="lg:mt-32 flex justify-evenly flex-wrap lg:block">
            <Link href="/order">
              <li
                className={`${
                  router.asPath === "/order" ? "active-link" : "link"
                }`}
              >
                <FaBagShopping
                  size={16}
                  className={`${
                    router.asPath === "/order"
                      ? "active-link-icon"
                      : "link-icon"
                  }`}
                />
                <span
                  className={`${
                    router.asPath === "/order" ? "" : "hidden sm:inline"
                  }`}
                >
                  New Order
                </span>
              </li>
            </Link>
            <Link href="/history">
              <li
                className={`${
                  router.asPath === "/history" ? "active-link" : "link"
                }`}
              >
                <FaHistory
                  size={16}
                  className={`${
                    router.asPath === "/history"
                      ? "active-link-icon"
                      : "link-icon"
                  }`}
                />
                <span
                  className={`${
                    router.asPath === "/history" ? "" : "hidden sm:inline"
                  }`}
                >
                  History
                </span>
              </li>
            </Link>
            <Link href="/referral">
              <li
                className={`${
                  router.asPath === "/referral" ? "active-link" : "link"
                }`}
              >
                <FaUserGroup
                  size={16}
                  className={`${
                    router.asPath === "/referral"
                      ? "active-link-icon"
                      : "link-icon"
                  }`}
                />
                <span
                  className={`${
                    router.asPath === "/referral" ? "" : "hidden sm:inline"
                  }`}
                >
                  Referrals
                </span>
              </li>
            </Link>
            <Link href="/funds">
              <li
                className={`${
                  router.asPath === "/funds" ? "active-link" : "link"
                }`}
              >
                <FaWallet
                  size={16}
                  className={`${
                    router.asPath === "/funds"
                      ? "active-link-icon"
                      : "link-icon"
                  }`}
                />
                <span
                  className={`${
                    router.asPath === "/funds" ? "" : "hidden sm:inline"
                  }`}
                >
                  Add Funds
                </span>
              </li>
            </Link>
          </ul>
        </motion.aside>
      )}
    </>
  );
};

export default SideNav;
