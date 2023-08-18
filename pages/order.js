import React, { useState, useEffect } from "react";
import { FaBagShopping, FaCircleExclamation, FaXmark } from "react-icons/fa6";
import { Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { motion } from "framer-motion";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Order = () => {
  const { data: session, update } = useSession();
  const [show, setShow] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [service, setService] = useState({});
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState(0);
  const [link, setLink] = useState("");
  const [comments, setComments] = useState("");
  const [answerNumber, setAnswerNumber] = useState("");
  const [username, setUsername] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [delay, setDelay] = useState(0);
  const [date, setDate] = useState("01/01/2023");
  const [type, setType] = useState("Default");
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoadingData(true);
      const res = await fetch("/api/service");
      const data = await res.json();

      if (res.ok) {
        setData(data.services);
        let categories = data.services
          .map((el, i, arr) =>
            el.category === arr[i + 1]?.category ? null : el.category
          )
          .filter((el) => el);
        setCategory(categories[0]);
        setFilteredData(
          data.services.filter((el) => el.category === categories[0])
        );
        setService(data.services[0]);
        setCategories(categories);
      }
      setLoadingData(false);
    };
    getData();
  }, []);

  const handleSubmit = async () => {
    setShow(false);
    setLoading(true);
    const res = await fetch("/api/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId: service.service,
        type,
        quantity,
        link,
        comments,
        answerNumber,
        username,
        hashtags,
        delay,
        date,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setCreated(true);
      await update({
        ...session,
        user: {
          ...session.user,
          balance: session.user.balance - data.charge,
          spending: session.user.spending + data.charge,
        },
      });
    } else {
      console.log(data);
      setError(data.error);
      setTimeout(() => setError(""), 5000);
    }
    setLoading(false);
  };

  return (
    <section className="flex  items-center flex-1 overflow-y-auto flex-col pt-10 md:pt-20 pb-40 md:pb-60 px-10">
      <motion.h1
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "tween" }}
        className="sm:text-5xl text-2xl font-bold flex justify-center items-center"
      >
        Pick Your Order{" "}
        <FaBagShopping size={64} color="#E94B19" className="inline-block m-2" />
      </motion.h1>
      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        className="lg:w-[800px] w-full mt-10"
      >
        {loadingData ? (
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="text-4xl font-bold flex justify-center items-center"
          >
            Loading...
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="text-2xl font-bold flex justify-center items-center text-red-500">
                {error}
              </div>
            )}
            <div className="relative">
              <p className="text-2xl font-normal">Category</p>
              <div className="mx-auto my-2 flex justify-center">
                <Select
                  defaultValue={category}
                  showSearch
                  onChange={(value) => {
                    if (value) {
                      setCategory(value);
                      setFilteredData(
                        data.filter((el) => el.category === value)
                      );
                      setService(data.filter((el) => el.category === value)[0]);
                      setType(
                        data.filter((el) => el.category === value)[0].type
                      );
                    }
                  }}
                  allowClear={{ clearIcon: <FaXmark color="red" /> }}
                  filterOption={(input, option) =>
                    (option?.value ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {categories &&
                    categories.map((cat) => (
                      <Select.Option key={cat} value={cat}>
                        {cat}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
            <div className="relative mt-4">
              <p className="text-2xl font-normal">Service</p>
              <div className="mx-auto my-2 flex justify-center">
                <Select
                  defaultValue={service.service}
                  showSearch
                  onChange={(value) => {
                    if (value) {
                      setService(
                        filteredData.filter((el) => el.service === value)[0]
                      );
                      setType(
                        filteredData.filter((el) => el.service === value)[0]
                          .type
                      );
                    }
                  }}
                  allowClear={{ clearIcon: <FaXmark color="red" /> }}
                  filterOption={(input, option) =>
                    (option?.value.name ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {filteredData &&
                    filteredData.map((el) => (
                      <Select.Option key={el.service} value={el.service}>
                        {/* {`${el.name} $${el.rate * 1.1} ${
                          el.type === "Custom Comments Package" ||
                          el.type === "Package"
                            ? "Per 1"
                            : "Per 1K"
                        }`} */}
                        {el.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
            {type === "Default" ? (
              <>
                {" "}
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    type="text"
                    value={quantity}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={
                      Number.isNaN(quantity * (service.rate / 1000) * 1.1)
                        ? ""
                        : `$${quantity * (service.rate / 1000) * 1.1}`
                    }
                    readOnly
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Package" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={`$${service.rate * 1.1}`}
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Custom Comments" ||
              type === "Custom Comments Package" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>

                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Comments</p>
                  <textarea
                    value={comments}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => {
                      setComments(e.target.value);
                    }}
                    type="text"
                    className="w-[95%] h-40 block my-2 mx-auto bg-input-secondary text-sm font-normal py-2 px-6 rounded-lg resize-none"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={
                      comments.split("\n").filter((com) => com.length).length
                    }
                    readOnly
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={`$${
                      type === "Custom Comments"
                        ? comments.split("\n").filter((com) => com.length)
                            .length *
                          (service.rate / 1000) *
                          1.1
                        : comments.split("\n").filter((com) => com.length)
                            .length *
                          service.rate *
                          1.1
                    }`}
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Poll" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={quantity}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Answer Number</p>
                  <input
                    value={answerNumber}
                    onChange={(e) => setAnswerNumber(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={
                      Number.isNaN(quantity * (service.rate / 1000) * 1.1)
                        ? ""
                        : `$${quantity * (service.rate / 1000) * 1.1}`
                    }
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Comment Replies" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>

                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Comments</p>
                  <textarea
                    value={comments}
                    onChange={(e) => {
                      setComments(e.target.value);
                    }}
                    type="text"
                    className="w-[95%] h-40 block my-2 mx-auto bg-input-secondary text-sm font-normal py-2 px-6 rounded-lg resize-none"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Username</p>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={
                      comments.split("\n").filter((com) => com.length).length
                    }
                    readOnly
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={`$${
                      comments.split("\n").filter((com) => com.length).length *
                      (service.rate / 1000) *
                      1.1
                    }`}
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Invites from Groups" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={quantity}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Groups</p>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    type="text"
                    className="w-[95%] h-40 block my-2 mx-auto bg-input-secondary text-sm font-normal py-2 px-6 rounded-lg resize-none"
                  />
                </div>

                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={
                      Number.isNaN(quantity * (service.rate / 1000) * 1.1)
                        ? ""
                        : `$${quantity * (service.rate / 1000) * 1.1}`
                    }
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Comment Likes" ||
              type === "Mentions User Followers" ||
              type === "Mentions Media Likers" ||
              type === "Mentions Hashtag" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={quantity}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">
                    {`${
                      type === "Comment Likes"
                        ? "Username of comment owner"
                        : type === "Mentions User Followers"
                        ? "Username"
                        : type === "Mentions Media Likers"
                        ? "Media URL"
                        : type === "Mentions Hashtag"
                        ? "Hashtag"
                        : ""
                    }`}
                  </p>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={
                      Number.isNaN(quantity * (service.rate / 1000) * 1.1)
                        ? ""
                        : `$${quantity * (service.rate / 1000) * 1.1}`
                    }
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Mentions" || type === "Mentions Custom List" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={quantity}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Usernames</p>
                  <textarea
                    value={comments}
                    onChange={(e) => {
                      setComments(e.target.value);
                    }}
                    type="text"
                    className="w-[95%] h-40 block my-2 mx-auto bg-input-secondary text-sm font-normal py-2 px-6 rounded-lg resize-none"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={
                      Number.isNaN(quantity * (service.rate / 1000) * 1.1)
                        ? ""
                        : `$${quantity * (service.rate / 1000) * 1.1}`
                    }
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Mentions with Hashtags" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Link</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={quantity}
                    placeholder={`Min-${service.min} Max-${service.max}`}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Usernames</p>
                  <textarea
                    value={comments}
                    onChange={(e) => {
                      setComments(e.target.value);
                    }}
                    type="text"
                    className="w-[95%] h-40 block my-2 mx-auto bg-input-secondary text-sm font-normal py-2 px-6 rounded-lg resize-none"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Hashtags</p>
                  <textarea
                    value={hashtags}
                    onChange={(e) => {
                      setHashtags(e.target.value);
                    }}
                    type="text"
                    className="w-[95%] h-40 block my-2 mx-auto bg-input-secondary text-sm font-normal py-2 px-6 rounded-lg resize-none"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Charge</p>
                  <input
                    type="text"
                    value={
                      Number.isNaN(quantity * (service.rate / 1000) * 1.1)
                        ? ""
                        : `$${quantity * (service.rate / 1000) * 1.1}`
                    }
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
              </>
            ) : type === "Subscriptions" ? (
              <>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Username</p>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Posts</p>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    type="text"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Quantity</p>
                  <input
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                    type="text"
                    placeholder="MIN"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                  <input
                    value={charge}
                    onChange={(e) => {
                      setCharge(e.target.value);
                    }}
                    type="text"
                    placeholder="MAX"
                    className="w-[95%] h-10 block my-2 mx-auto bg-input-secondary text-sm font-normal px-6 rounded-lg"
                  />
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Delay</p>
                  <div className="mx-auto my-2 flex justify-center">
                    <Select
                      defaultValue={delay}
                      onChange={(value) => {
                        setDelay(value);
                      }}
                    >
                      <Select.Option value={0}>0</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                      <Select.Option value={10}>10</Select.Option>
                      <Select.Option value={15}>15</Select.Option>
                      <Select.Option value={30}>30</Select.Option>
                      <Select.Option value={60}>60</Select.Option>
                      <Select.Option value={90}>90</Select.Option>
                    </Select>
                  </div>
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-normal">Expiry (Optional)</p>
                  <div className="mx-auto my-2 flex justify-center">
                    {/* TODO: */}
                    <DatePicker
                      defaultValue={dayjs(date, "DD/MM/YYYY")}
                      format={"DD/MM/YYYY"}
                      onChange={(date, dateString) => setDate(dateString)}
                      allowClear={{
                        clearIcon: <FaXmark color="red" size={18} />,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold flex justify-center items-center">
                  That type of service is not available, please contact us with
                  that problem.
                </div>
              </>
            )}
          </>
        )}
        <div className="flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            onClick={() => setShow(true)}
            disabled={loading}
            className={`w-[413px] text-3xl font-bold bg-primary ${
              loading && "opacity-60"
            } rounded-full py-2 mt-10 hover:opacity-60 transition-opacity duration-300`}
          >
            {loading ? "Submitting..." : "Submit Order"}
          </motion.button>
        </div>
      </form>
      {show && (
        <div className="absolute z-20 px-10 w-screen h-screen left-0 top-0 bg-black/40 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="w-[505px] h-[383px] bg-gradient-secondary rounded-3xl relative shadow-main flex flex-col justify-around items-center p-6"
          >
            <FaCircleExclamation size={70} color="#E94B19" />
            <div>
              <p className="font-bold sm:text-2xl text-lg text-center my-2">
                Do you want to confirm on this order?
              </p>
              <p className="font-bold sm:text-lg text-sm text-center my-2">
                After Confirming there is no refund policy
              </p>
            </div>
            <div>
              <button
                onClick={() => setShow(false)}
                className="sm:w-[188px] px-4 sm:px-0 py-2 bg-transparent font-bold sm:text-2xl rounded-full border mx-2 hover:bg-white hover:text-black transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="sm:w-[188px] px-4 sm:px-0 py-2 bg-primary font-bold sm:text-2xl rounded-full mx-2 hover:opacity-60 transition-opacity duration-300"
              >
                Confirm
              </button>
            </div>

            <FaXmark
              className="absolute top-6 end-6 cursor-pointer"
              onClick={() => setShow(false)}
              size={22}
            />
          </motion.div>
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={created}
        autoHideDuration={6000}
        onClose={() => setCreated(false)}
      >
        <Alert
          onClose={() => setCreated(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Order Submitted!
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Order;
