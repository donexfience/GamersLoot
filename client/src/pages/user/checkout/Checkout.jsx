import React, { useEffect, useState } from "react";
import Checkoutradio from "./components/Checkoutradio";
import AddressCheckout from "./components/AddressCheckout";
import Addaddress from "./pages/Addaddress";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import CheckoutPayment from "./components/CheckoutPayment";
import CheckoutCartRow from "./components/CheckoutCartRow";
import TotalPrice from "../cart/TotalPrice";
import axios from "axios";
import { URL } from "../../../Common/api";
import { config } from "../../../Common/configurations";
import toast from "react-hot-toast";
import { GiCleaver } from "react-icons/gi";
import { clearCartOnOrderPlaced } from "../../../redux/reducers/user/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //wallet 

  const [walletbalance,setWalletBalance]=useState(0);
  // taking the cart details for checkout

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { totalPrice, shipping, tax } = useSelector((state) => state.cart);

  console.log(cart, "0000000000000");

  //selected address
  const [selectedAddress, setSelectedAddress] = useState("");

  //if any offers
  let offer = 0;
  const finalTotal = totalPrice + shipping + tax - offer;

  //handling payment
  const [selectedPayment, setSelectedPayment] = useState(null);
  // console.log(selectedPayment,"selectedpayment state")
  //payment selection

  const handleSelectedPayment = (e) => {
    // console.log(e.target.value,'payment method')
    setSelectedPayment(e.target.value);
  };
  //delievery messages
  const [delieveryMessage, setDelieveyMessage] = useState("");

  //naviagation to confirmation page

  const navigateOrderConfirmation = (order) => {
    if (order) {
      navigate("/order-confirmation", { state: order });
    }
  };
  //order success page switching

  const [orderPlaceLoading, setOrderPlaceLoading] = useState(false);
  const [orderData, setOrderData] = useState(false);

  //cash on delievery saving on backend

  const saveOrderOnCashOnDelivery = async () => {
    setOrderPlaceLoading(true);
    try {
      const order = await axios.post(
        `${URL}/user/order`,
        {
          address: selectedAddress,
          paymentMode: selectedPayment,
          notes: delieveryMessage,
        },
        config
      );

      // navigation state
      setOrderData(true);
      toast.success("Order Placed");
      setOrderPlaceLoading(false);
      navigateOrderConfirmation(order.data.order);
      dispatch(clearCartOnOrderPlaced());
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "something went wrong while placing the order";
    }
    setOrderPlaceLoading(false);
  };
  //order placing function

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Added something to cart");
    }
    if (!selectedAddress) {
      toast.error("delivery address not found");
    }
    if (!selectedPayment) {
      toast.error("Please select any payment method");
    }
    //backend calling

    if (selectedPayment === "cashOnDelivery") {
      saveOrderOnCashOnDelivery();
    }
  };

  useEffect(() => {
    if (orderData) {
      navigate(-1);
    }
  }, [orderData]);
  return (
    <>
      {orderPlaceLoading ? (
        <Loading size={20} />
      ) : (
        <div className="pt-20 px-5 lg:p-20 shadow-md lg:flex  items-start gap-5 bg-gray-100">
          <div className="w-3/4">
            <AddressCheckout
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            <div className="bg-white my-5 p-5 w-full shadow-md">
              <h1 className="font-bold">Payment Options</h1>
              <div className="border border-violet-500 px-5 mt-2"></div>
              <CheckoutPayment
                handleSelectPayment={handleSelectedPayment}
                selectedPayment={selectedPayment}
              />
            </div>
            <div className="bg-white my-3 p-5 w-full shadow-md">
              <p className="mu-1 font-bold ">Delivery Messages</p>
              <div className="border border-violet-500 px-5 mt-2"></div>

              <textarea
                placeholder="Notes about your order e.g. special notes for delivery"
                className="w-full h-40 px-3 py-2 outline-none rounded resize-none"
                value={delieveryMessage}
                onChange={(e) => {
                  setDelieveyMessage(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="lg:w-1/4 bg-white px-5 py-3 border border-gray-200 rounded shrink-0">
            <h1 className="font-bold py-2">Order Summery</h1>
            <div className="py-2">
              {cart &&
                cart.map((item, index) => (
                  <CheckoutCartRow item={item} key={index} />
                ))}
            </div>
            <TotalPrice />
            <button
              className="w-full bg-violet-500 text-white rounded-md p-3 hover:bg-red-500"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
