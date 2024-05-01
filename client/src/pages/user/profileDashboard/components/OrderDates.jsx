import React from "react";
import { getStatusDates } from "../../../../Common/Functions";
import date from "date-and-time";

const OrderDates = ({ orderData }) => {
  let statusArray = orderData.statusHistory;
  console.log(statusArray);

  if (orderData.status === "delivered") {
    return (
      <p>
        <span className="text-violet-500">Product Delivered On: </span>
        {getStatusDates("delivered", orderData.statusHistory)}
      </p>
    );
  }
  if (orderData.status === "canceled") {
    return (
      <div>
        <p>
          <span className="text-violet-500">Order Canceled On:</span>{" "}
          {getStatusDates("canceled", orderData.statusHistory)}
        </p>
        <p className="line-clamp-1">
          <span>Reason for Cancellation:</span>{" "}
          {orderData.statusHistory[0].reason}
        </p>
      </div>
    );
  }
  if (orderData.status === "return request") {
    return (
      <div>
        <p>
          <span className="text-violet-500">Return Requested On:</span>{" "}
          {getStatusDates("return request", orderData.statusHistory)}
        </p>
        <p className="line-clamp-1">
          <span>Reason for Return:</span>{" "}
          {orderData.statusHistory.find(
            (status) => status.status === "return request"
          ).reason}
        </p>
      </div>
    );
  }
  return (
    <p className="flex flex-col">
      <span className="font-semibold text-red-500">Expected Arrival Date:</span>{" "}
      {date.format(new Date(orderData.deliveryDate), "DD MM YYYY")}
    </p>
  );
};

export default OrderDates;
