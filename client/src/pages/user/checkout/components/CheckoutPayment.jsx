import React from "react";
import GoobglePay from "../../../../assets/GooglePay.jpg";
import RazorPay from "../../../../assets/RazorPay.jpg";

const CheckoutPayment = ({ handleSelectPayment, selectedPayment }) => {
    console.log(selectedPayment,"from sub component")
  return (
    <div className="flex items-center justify-center py-5">
      <label
        className="cursor-pointer flex items-center gap-2 flex-col"
        htmlFor="cash"
      >
        <div className="w-16 h-10 mr-2">
          <img
            src={GoobglePay}
            alt="Google Pay"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-sm font-bold text-violet-500">
          Cash on Delivery
        </span>
        <input
          type="radio"
          name="paymentMode"
          id="cashOnDelivery"
          value="cashOnDelivery"
          onChange={handleSelectPayment}
          checked={selectedPayment === "cashOnDelivery"}
        />
      </label>
      <label
        className="gap-2 flex-col cursor-pointer flex items-center ml-4"
        htmlFor="cash"
      >
        <div className="w-15 h-10 mr-2">
          <img
            src={RazorPay}
            alt="RazorPay"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-sm font-bold text-violet-500">RazorPay</span>
        <input
          type="radio"
          name="paymentMode"
          id="razorPay"
          value="razorPay"
          onChange={handleSelectPayment}
          checked={selectedPayment === "razorPay"}
        />
      </label>
    </div>
  );
};

export default CheckoutPayment;
