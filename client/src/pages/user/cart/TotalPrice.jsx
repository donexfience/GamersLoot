import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotalPrice } from "../../../redux/reducers/user/cartSlice";

const TotalPrice = () => {
  const { totalPrice, shipping, discount, tax, couponType, couponCode } =
    useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotalPrice());
  });

  console.log("🚀 ~ file: TotalPrice.jsx:7 ~ TotalPrice ~ cart:", totalPrice);

  let offer = 0;
  const finalprice = totalPrice + shipping + parseInt(tax) - offer;
  return (
    <div className="border-b border-gray-200 pb-2 mb-2">
      <div className="cart-total-list flex justify-between">
        <p className="cart-total-list-first font-bold text-violet-500">Sub Total</p>
        <p className="cart-total-list-second">{totalPrice}₹</p>
      </div>

      <div className="cart-total-list flex justify-between">
        <p className="cart-total-list-first font-bold text-violet-500">Tax</p>
        <p className="cart-total-list-second">{parseInt(tax)}₹</p>
      </div>

      <div className="cart-total-list flex justify-between">
        <p className="cart-total-list-first font-bold text-violet-500">Shipping</p>
        <p className="cart-total-li-second">
          {shipping === 0 ? "Free" : shipping}
        </p>
      </div>
      <div className="cart-total-list flex justify-between">
        <p className=" font-bold text-red-400">Total</p>
        <p className="text-red-500 font-semibold">{finalprice}₹</p>
      </div>
    </div>
  );
};

export default TotalPrice;
