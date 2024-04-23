import React from "react";

const OrderHistoryAddress = ({ title, address }) => {
  console.log(address)
  return (
    <div className="border-b lg:border-b-0 lg:border-r p-5 lg:w-1/3">
      <h1 className="text-md">{title}</h1>
      <p className="pt-4 pb-2">
        {address.firstName} {address.lastName}{" "}
      </p>
      <p className="tex-gray-500">
        {address.city}, pinc code : {address.pinCode}
      </p>
      <p className="py-2">
        phone Number : <span className="text-black">{address.phoneNumber}</span>
      </p>
      <p className="py-2">
        Email:{" "}
        <span className="text-grayy-500">
          {address.email || "Email is not Provided"}
        </span>
      </p>
    </div>
  );
};

export default OrderHistoryAddress;
