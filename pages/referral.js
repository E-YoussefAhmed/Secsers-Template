import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Referral = () => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: session, status } = useSession();
  // console.log(session?.user);
  return (
    <section className="flex items-center flex-1 flex-col overflow-y-auto pt-10 md:pt-32 pb-40 lg:pb-60 px-10">
      {status === "loading" ? (
        <div className="text-4xl font-bold flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="flex flex-col md:flex-row gap-5 justify-evenly w-full"
          >
            <div className="flex flex-col items-center">
              <h2 className="text-primary text-2xl md:text-[40px] font-semibold">
                Referral Code
              </h2>
              <p className="md:p-10 p-5 md:h-[130px] rounded-lg border-[5px] border-primary flex justify-center items-center text-lg md:text-2xl font-normal mt-8">
                {session.user.referralCode}
                <CopyToClipboard
                  onCopy={() => setCopied(true)}
                  text={`${session.user.referralCode}`}
                >
                  <button>
                    <FaRegCopy className="mx-6" />
                  </button>
                </CopyToClipboard>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-primary text-2xl md:text-[40px] font-semibold">
                Referral Link
              </h2>
              <p className="md:h-[130px] rounded-lg border-[5px] border-primary flex justify-center items-center text-lg md:text-2xl font-normal mt-8 p-5 md:p-11">
                {`http://localhost:3000/?referral=${session.user.referralCode}`}
                <CopyToClipboard
                  onCopy={() => setCopied(true)}
                  text={`http://localhost:3000/?referral=${session.user.referralCode}`}
                >
                  <button>
                    <FaRegCopy className="mx-6" />
                  </button>
                </CopyToClipboard>
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            onClick={() => setShow(!show)}
            className="text-2xl border-b mt-24 mb-5 hover:text-primary hover:border-primary transition-colors duration-300"
          >
            {show ? "Hide" : "View"} History
          </motion.button>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: "tween" }}
              className="bg-[#07021C] w-full min-h-[300px] overflow-auto p-2 rounded"
            >
              <div className="w-full min-w-[800px] bg-[#1C114A] rounded ">
                <div className="w[1050px] min-w-[800px] w-full h-[35px] p-2 text-base font-bold flex mx-auto">
                  <div className="w-1/4 flex justify-center items-center">
                    ID
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    Name
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    Amount
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    Date
                  </div>
                </div>
              </div>
              <div className="w-full">
                {session.user.referrals.length ? (
                  session.user.referrals.map((referral) => (
                    <>
                      <div
                        key={referral._id}
                        className="w[1050px] min-w-[800px] w-full h-[35px] my-3 border rounded p-2 text-base font-bold flex mx-auto"
                      >
                        <div className="w-1/4 flex justify-center items-center">
                          {referral.userId}
                        </div>
                        <div className="w-1/4 flex justify-center items-center">
                          {referral.name}
                        </div>
                        <div className="w-1/4 flex justify-center items-center">
                          ${referral.amount}
                        </div>
                        <div className="w-1/4 flex justify-center items-center">
                          {new Date(referral.createdAt).getDate()}/
                          {new Date(referral.createdAt).getMonth() + 1}/
                          {new Date(referral.createdAt).getFullYear()}
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="text-center my-20">No Referrals Yet</div>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={copied}
        autoHideDuration={6000}
        onClose={() => setCopied(false)}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Text Copied!
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Referral;
