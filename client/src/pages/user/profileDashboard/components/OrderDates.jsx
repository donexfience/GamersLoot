import React from "react";
import { getStatusDates } from "../../../../Common/Functions";
import date from "date-and-time";

const OrderDates = ({ orderData }) => {
  if (orderData.status === "delivered") {
    return (
      <p>
        <span className="text-violet-500">Product will be delivered : </span>
        {getStatusDates("delivered", orderData.statusHistory)}
      </p>
    );
  }
  if (orderData.status === "canceled") {
    return (
      <div>
        <p>
          <span className="text-violet-500">Order canceled on :</span>
          {getStatusDates("canceled", orderData.statusHistory)}
        </p>
        <p className="line-clamp-1">
          <span>Reason for Cancel</span>
          {getStatusDates("canceled", orderData.statusHistory)}
        </p>
      </div>
    );
  }
  return (
    <p className="flex flex-col">
      <span className="font-semibold text-red-500">Order expected arrival</span>
      {date.format(new Date(orderData.deliveryDate), "DD MM  YYYY")}
    </p>
  );
};

export default OrderDates;
