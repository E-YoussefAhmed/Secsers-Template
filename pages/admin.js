import UserCard from "@components/UserCard";
import React from "react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import useSWR from "swr";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { motion } from "framer-motion";

const parentVariants = {
  hide: {},
  show: {
    transition: {
      duration: 0.5,
      type: "tween",
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Admin = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetcher = (api) => fetch(api).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/admin", fetcher, {
    refreshInterval: 300,
  });

  return (
    <section className="pt-10 pb-60 px-8 flex-1 overflow-auto">
      <div className="mb-5 flex justify-end relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFilteredData(
              data.filter(
                (el) =>
                  el.userId.toString().includes(e.target.value) ||
                  el.email.includes(e.target.value)
              )
            );
          }}
          className="bg-[#070122] sm:w-60 w-full rounded h-10 px-7 placeholder:text-xs"
          placeholder="Search"
        />
        <FaMagnifyingGlass
          size={16}
          className="absolute end-3 top-1/2 transform -translate-y-1/2 opacity-60"
        />
      </div>
      <div className="bg-[#07021C] w-full h-full overflow-auto p-2 rounded">
        <div className="w-full min-w-[700px] bg-[#1C114A] rounded ">
          <div className="h-[35px] p-2 text-base font-bold flex mx-auto">
            <div className="w-1/4 flex justify-center items-center">ID</div>
            <div className="w-1/4 flex justify-center items-center">Email</div>
            <div className="w-1/4 flex justify-center items-center">
              Verified
            </div>
            <div className="w-1/4 flex justify-center items-center">
              Balance
            </div>
          </div>
        </div>
        <motion.div
          variants={parentVariants}
          initial="hide"
          animate="show"
          className="w-full"
        >
          {isLoading ? (
            <div className="text-4xl font-bold flex justify-center items-center">
              Loading...
            </div>
          ) : search.length ? (
            filteredData.length ? (
              filteredData.map((user) => (
                <motion.div
                  variants={variants}
                  className="h-[35px] min-w-[700px] hover:bg-primary/50 transition-colors duration-300 my-3 border rounded p-2 text-base font-bold flex mx-auto cursor-pointer"
                  key={user._id}
                  onClick={() => {
                    setActiveUser(user);
                    setShow(true);
                  }}
                >
                  <div className="w-1/4 flex justify-center items-center">
                    {user.userId}
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    {user.email}
                  </div>
                  <div
                    className={`w-1/4 flex justify-center items-center ${
                      user.verified ? "text-completed" : "text-canceled"
                    }`}
                  >
                    {user.verified ? "Verified" : "Not Verified"}
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    ${user.balance}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={variants}
                className="text-4xl font-bold mt-10 flex justify-center items-center"
              >
                No Match Found
              </motion.div>
            )
          ) : data.length ? (
            data.map((user) => (
              <motion.div
                variants={variants}
                className="h-[35px] min-w-[700px] hover:bg-primary/50 transition-colors duration-300 my-3 border rounded p-2 text-base font-bold flex mx-auto cursor-pointer"
                key={user._id}
                onClick={() => {
                  setActiveUser(user);
                  setShow(true);
                }}
              >
                <div className="w-1/4 flex justify-center items-center">
                  {user.userId}
                </div>
                <div className="w-1/4 flex justify-center items-center">
                  {user.email}
                </div>
                <div
                  className={`w-1/4 flex justify-center items-center ${
                    user.verified ? "text-completed" : "text-canceled"
                  }`}
                >
                  {user.verified ? "Verified" : "Not Verified"}
                </div>
                <div className="w-1/4 flex justify-center items-center">
                  ${user.balance}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={variants}
              className="text-4xl font-bold mt-10 flex justify-center items-center"
            >
              No Data Found
            </motion.div>
          )}
        </motion.div>
      </div>
      {show && (
        <UserCard
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          setShow={setShow}
          setShowBalance={setShowBalance}
          setShowDeleted={setShowDeleted}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showDeleted}
        autoHideDuration={6000}
        onClose={() => setShowDeleted(false)}
      >
        <Alert
          onClose={() => setShowDeleted(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          User Deleted Successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showBalance}
        autoHideDuration={6000}
        onClose={() => setShowBalance(false)}
      >
        <Alert
          onClose={() => setShowBalance(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Balance Changed Successfully!
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Admin;
