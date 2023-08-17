import React, { useState } from "react";
import {
  FaBan,
  FaBarsProgress,
  FaFileImport,
  FaFilter,
  FaHourglassStart,
  FaMagnifyingGlass,
  FaRegCircleCheck,
  FaSpinner,
} from "react-icons/fa6";
import useSWR from "swr";
import { motion } from "framer-motion";

const History = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState("");
  const fetcher = (api) => fetch(api).then((res) => res.json());

  const { data, error, isLoading } = useSWR("/api/orders", fetcher, {
    refreshInterval: 300,
  });

  const handleFilter = (filter) => {
    setFilter(filter);
    setFilteredData(data.orders.filter((order) => order.status === filter));
  };

  return (
    <section className="flex  items-center flex-1 flex-col pt-10 pb-44 overflow-y-auto px-7">
      <div className="w-full flex flex-col-reverse lg:flex-row lg:justify-between">
        <motion.ul
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "tween" }}
          className="flex flex-wrap"
        >
          <li
            onClick={() => handleFilter(null)}
            className={`${
              filter === null ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaFilter className="me-2" size={13} />
            All
          </li>
          <li
            onClick={() => handleFilter("Pending")}
            className={`${
              filter === "Pending" ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaFileImport className="me-2" size={13} />
            Pending
          </li>
          <li
            onClick={() => handleFilter("In Progress")}
            className={`${
              filter === "In Progress" ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaSpinner className="me-2" size={13} />
            In Progress
          </li>
          <li
            onClick={() => handleFilter("Completed")}
            className={`${
              filter === "Completed" ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaRegCircleCheck className="me-2" size={13} />
            Completed
          </li>
          <li
            onClick={() => handleFilter("Partial")}
            className={`${
              filter === "Partial" ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaHourglassStart className="me-2" size={13} />
            Partial
          </li>
          <li
            onClick={() => handleFilter("Processing")}
            className={`${
              filter === "Processing" ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaBarsProgress className="me-2" size={13} />
            Processing
          </li>
          <li
            onClick={() => handleFilter("Canceled")}
            className={`${
              filter === "Canceled" ? "active-filter" : "filter"
            } cursor-pointer select-none`}
          >
            <FaBan className="me-2" size={13} />
            Canceled
          </li>
        </motion.ul>
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "tween" }}
          className="relative lg:basis-[424px] my-2 lg:my-0 min-w-[150px] flex items-center"
        >
          <input
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value) {
                if (filter) {
                  setFilteredData(
                    filteredData.filter(
                      (el) =>
                        el.id.toString().includes(e.target.value) ||
                        el.name.includes(e.target.value) ||
                        el.serviceLink.includes(e.target.value) ||
                        el.quantity.toString().includes(e.target.value) ||
                        el.charge.toString().includes(e.target.value)
                    )
                  );
                } else {
                  setFilteredData(
                    data.orders.filter(
                      (el) =>
                        el.id.toString().includes(e.target.value) ||
                        el.name.includes(e.target.value) ||
                        el.serviceLink.includes(e.target.value) ||
                        el.quantity.toString().includes(e.target.value) ||
                        el.charge.toString().includes(e.target.value)
                    )
                  );
                }
              } else {
                if (filter) {
                  handleFilter(filter);
                }
              }
            }}
            value={search}
            className="w-full h-10 bg-input-secondary px-5 rounded text-xs font-bold leading-3"
            placeholder="Search"
          />
          <FaMagnifyingGlass
            className="opacity-60 absolute end-3"
            color="white"
            size={16}
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: "tween" }}
        className="mt-3 w-full h-full min-h-[600px] py-5 px-3 bg-[#07021C] rounded overflow-auto"
      >
        <div className="history bg-[#1C114A] py-2">
          <div className="flex justify-center">ID</div>
          <div className="flex justify-center">Date</div>
          <div className="flex justify-center">Link</div>
          <div className="flex justify-center">Charge</div>
          <div className="flex justify-center">Start Count</div>
          <div className="flex justify-center">Quantity</div>
          <div className="flex justify-center">Service</div>
          <div className="flex justify-center">Remains</div>
          <div className="flex justify-center">Status</div>
        </div>
        {isLoading ? (
          <div className="text-4xl font-bold flex justify-center items-center">
            Loading...
          </div>
        ) : (
          <>
            {filter ? (
              <>
                {filteredData.map((order) => (
                  <div
                    key={order._id}
                    className="my-3 border rounded px-2 py-5 text-base font-bold history"
                  >
                    <div className="flex justify-center items-center">
                      {order.id}
                    </div>
                    <div className="flex justify-center items-center">
                      {new Date(order.date).getFullYear()}-
                      {new Date(order.date).getMonth() + 1}-
                      {new Date(order.date).getDate()}{" "}
                      {new Date(order.date).getHours()}:
                      {new Date(order.date).getMinutes()}
                    </div>
                    <div className=" flex justify-center items-center">
                      {order.serviceLink}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.charge}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.startCount && order.startCount}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.quantity}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.name}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.remains}
                    </div>
                    <div className="flex justify-center items-center">
                      <span
                        className={`${
                          order.status === "Completed"
                            ? "text-completed"
                            : order.status === "Partial"
                            ? "text-partial"
                            : order.status === "Canceled"
                            ? "text-canceled"
                            : order.status === "Processing"
                            ? "text-processing"
                            : order.status === "Pending"
                            ? "text-pending"
                            : "text-primary"
                        } font-semibold text-xs block border-2 ${
                          order.status === "Completed"
                            ? "border-completed"
                            : order.status === "Partial"
                            ? "border-partial"
                            : order.status === "Canceled"
                            ? "border-canceled"
                            : order.status === "Processing"
                            ? "border-processing"
                            : order.status === "Pending"
                            ? "border-pending"
                            : "border-primary"
                        }  rounded-full p-2`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : search.length ? (
              <>
                {filteredData.map((order) => (
                  <div
                    key={order._id}
                    className="my-3 border rounded px-2 py-5 text-base font-bold history"
                  >
                    <div className="flex justify-center items-center">
                      {order.id}
                    </div>
                    <div className="flex justify-center items-center">
                      {new Date(order.date).getFullYear()}-
                      {new Date(order.date).getMonth() + 1}-
                      {new Date(order.date).getDate()}{" "}
                      {new Date(order.date).getHours()}:
                      {new Date(order.date).getMinutes()}
                    </div>
                    <div className=" flex justify-center items-center">
                      {order.serviceLink}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.charge}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.startCount && order.startCount}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.quantity}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.name}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.remains}
                    </div>
                    <div className="flex justify-center items-center">
                      <span
                        className={`${
                          order.status === "Completed"
                            ? "text-completed"
                            : order.status === "Partial"
                            ? "text-partial"
                            : order.status === "Canceled"
                            ? "text-canceled"
                            : order.status === "Processing"
                            ? "text-processing"
                            : order.status === "Pending"
                            ? "text-pending"
                            : "text-primary"
                        } font-semibold text-xs block border-2 ${
                          order.status === "Completed"
                            ? "border-completed"
                            : order.status === "Partial"
                            ? "border-partial"
                            : order.status === "Canceled"
                            ? "border-canceled"
                            : order.status === "Processing"
                            ? "border-processing"
                            : order.status === "Pending"
                            ? "border-pending"
                            : "border-primary"
                        }  rounded-full p-2`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {data.orders.map((order) => (
                  <div className="my-3 border rounded px-2 py-5 text-base font-bold history">
                    <div className="flex justify-center items-center">
                      {order.id}
                    </div>
                    <div className="flex justify-center items-center">
                      {new Date(order.date).getFullYear()}-
                      {new Date(order.date).getMonth() + 1}-
                      {new Date(order.date).getDate()}{" "}
                      {new Date(order.date).getHours()}:
                      {new Date(order.date).getMinutes()}
                    </div>
                    <div className=" flex justify-center items-center">
                      {order.serviceLink}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.charge}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.startCount && order.startCount}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.quantity}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.name}
                    </div>
                    <div className="flex justify-center items-center">
                      {order.remains}
                    </div>
                    <div className="flex justify-center items-center">
                      <span
                        className={`${
                          order.status === "Completed"
                            ? "text-completed"
                            : order.status === "Partial"
                            ? "text-partial"
                            : order.status === "Canceled"
                            ? "text-canceled"
                            : order.status === "Processing"
                            ? "text-processing"
                            : order.status === "Pending"
                            ? "text-pending"
                            : "text-primary"
                        } font-semibold text-xs block border-2 ${
                          order.status === "Completed"
                            ? "border-completed"
                            : order.status === "Partial"
                            ? "border-partial"
                            : order.status === "Canceled"
                            ? "border-canceled"
                            : order.status === "Processing"
                            ? "border-processing"
                            : order.status === "Pending"
                            ? "border-pending"
                            : "border-primary"
                        }  rounded-full p-2`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
};

export default History;
