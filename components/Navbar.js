import { motion } from "framer-motion";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRightFromBracket,
  FaBars,
  FaChevronDown,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { Menu, MenuItem } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [show, setShow] = useState(false);
  const open = Boolean(anchorEl);
  const { data: session, status } = useSession();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "tween" }}
      className={`${
        router.pathname === "/" ? "hidden" : "flex"
      } w-full md:h-[104px] bg-navbar py-2 md:py-6 px-10 justify-between items-center`}
    >
      <Link href="/order">
        <div>
          <Image
            src="/icon.svg"
            alt="logo"
            width={197}
            height={56}
            className="h-[56px] w-fit object-contain"
          />
        </div>
      </Link>
      <div className="lg:hidden flex item">
        <FaBars onClick={() => setShow(true)} size={30} />
      </div>
      {status === "authenticated" && (
        <>
          <ul
            className={`hidden lg:flex items-center transition-opacity duration-300 ease-in ${
              status === "loading" ? "opacity-0" : "opacity-100"
            }`}
          >
            <li className="flex text-lg font-extrabold items-center mx-10 leading-5">
              <button
                onClick={(event) => setAnchorEl(event.currentTarget)}
                type="button"
                className="flex items-center"
              >
                Dark{" "}
                <span className="block mx-2">
                  <FaChevronDown size={19} />
                </span>
              </button>
              <Menu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "black",
                  },
                }}
              >
                <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                  Theme 1
                </MenuItem>
                <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                  Theme 2
                </MenuItem>
                <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                  Theme 3
                </MenuItem>
              </Menu>
            </li>
            <li className="flex text-lg font-extrabold items-center mx-10 leading-5">
              <button type="button">EN</button>
            </li>
            <li>
              {session.user.role === "user" ? (
                <Link href="/profile">
                  <button
                    className="h-[52px] w-[120px] bg-primary justify-between hover:opacity-60 transition-opacity duration-300 flex items-center p-4 pb-5 mx-10 rounded-full"
                    type="button"
                  >
                    <FaUser size={27} color="#fff" />
                    <div>
                      <p className="text-[10px] font-bold text-start">
                        {session.user.name.split(" ")[0]}
                      </p>
                      <p className="text-base font-bold">
                        ${Math.floor(session.user.balance * 100) / 100}
                      </p>
                    </div>
                  </button>
                </Link>
              ) : (
                <div
                  className="h-[52px] w-[120px] bg-sidebar justify-between hover:opacity-60 transition-opacity duration-300 flex items-center p-4 pb-5 mx-10 rounded-full"
                  type="button"
                >
                  <FaUser size={27} color="#fff" />
                  <div>
                    <p className="text-lg font-bold text-start">
                      {session.user.name.split(" ")[0]}
                    </p>
                  </div>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="flex flex-col items-center"
              >
                <FaArrowRightFromBracket size={22} />
                <span className="text-[10px] font-bold"> Log Out </span>
              </button>
            </li>
          </ul>
          {show && (
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
              className="lg:hidden absolute top-0 end-0 w-4/5 bg-gradient-secondary py-20 z-50 h-full"
            >
              <div className="m-10 flex justify-end">
                <FaXmark size={30} onClick={() => setShow(false)} />
              </div>
              <ul className="flex flex-col-reverse lg:hidden">
                <li className="flex text-lg font-extrabold items-center m-10 leading-5">
                  <button
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    type="button"
                    className="flex items-center"
                  >
                    Dark{" "}
                    <span className="block mx-2">
                      <FaChevronDown size={19} />
                    </span>
                  </button>
                  <Menu
                    id="demo-customized-menu"
                    MenuListProps={{
                      "aria-labelledby": "demo-customized-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{
                      "& .MuiPaper-root": {
                        backgroundColor: "black",
                      },
                    }}
                  >
                    <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                      Theme 1
                    </MenuItem>
                    <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                      Theme 2
                    </MenuItem>
                    <MenuItem sx={{ color: "white" }} onClick={handleClose}>
                      Theme 3
                    </MenuItem>
                  </Menu>
                </li>
                <li className="flex text-lg font-extrabold items-center m-10 leading-5">
                  <button type="button">EN</button>
                </li>
                <li className="flex items-center">
                  {session.user.role === "user" ? (
                    <Link href="/profile">
                      <button
                        className="h-[52px] w-[120px] bg-primary justify-between hover:opacity-60 transition-opacity duration-300 flex items-center p-4 pb-5 m-10 rounded-full"
                        type="button"
                        onClick={() => setShow(false)}
                      >
                        <FaUser size={27} color="#fff" />
                        <div>
                          <p className="text-[10px] font-bold text-start">
                            {session.user.name.split(" ")[0]}
                          </p>
                          <p className="text-base font-bold">
                            ${Math.floor(session.user.balance * 100) / 100}
                          </p>
                        </div>
                      </button>
                    </Link>
                  ) : (
                    <div
                      className="h-[52px] w-[120px] bg-sidebar justify-between hover:opacity-60 transition-opacity duration-300 flex items-center p-4 pb-5 m-10 rounded-full"
                      type="button"
                    >
                      <FaUser size={27} color="#fff" />
                      <div>
                        <p className="text-lg font-bold text-start">
                          {session.user.name.split(" ")[0]}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShow(false);
                      signOut();
                    }}
                    className="flex flex-col items-center"
                  >
                    <FaArrowRightFromBracket size={22} />
                    <span className="text-[10px] font-bold"> Log Out </span>
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </>
      )}
    </motion.nav>
  );
};

export default Navbar;
