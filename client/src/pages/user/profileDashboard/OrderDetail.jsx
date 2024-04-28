import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../../Common/api";
import { config } from "../../../Common/configurations";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/Modal";
import ProductReview from "./ProductReview";
import CancelOrder from "./CancelOrder";
import backbutton from "../../../assets/backbutton.png";
import { TiCancel } from "react-icons/ti";
import date from "date-and-time";
import OrderDates from "./components/OrderDates";
import { modifyPaymentText } from "../../../Common/Functions";
import StatusComponent from "../../../components/StatusComponent";
import StatusHistoryLoadingBar from "./components/StatusHistoryProgressBar";
import OrderDetailProductRow from "./components/OrderDetailProductRow";
import OrderDetailsProductRow from "./components/OrderDetailProductRow";
import OrderHistoryAddress from "./components/OrderHistoryAddress";
import YourReview from "./components/YourReview";

const OrderDetail = () => {
  const naviagte = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //cancel modal
  const [cancelModal, setCancelModal] = useState(false);
  const togglecancelModal = () => {
    setCancelModal(!cancelModal);
  };
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const toggleReviewModal = (review) => {
    setReviewProduct(review);
    console.log(review, "--------------------------------");
    setReviewModal(!reviewModal);
  };
  //fetching id from the URL

  const { id } = useParams();
  //loading user data on Initial load
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/user/order/${id}`, config);
      if (res) {
        setOrderData(res.data.order);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };
  //fetching data at initial
  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <div className="w-full">
      {reviewModal && (
        <Modal
          content={
            <ProductReview
              closeToggle={toggleReviewModal}
              reviewingProduct={reviewProduct}
              id={id}
            />
          }
        />
      )}
      {cancelModal && (
        <Modal
          content={
            <CancelOrder
              id={id}
              closeToggle={togglecancelModal}
              loadData={loadData}
            />
          }
        />
      )}

      {orderData && (
        <div className="w-full">
          <div className="bg-white w-full shadow-xl p-5  min-h-screen ">
            <div className="rounded-lg bg-white">
              <div className="bg-white border-b pb-3 flex items-center justify-between px-5 py-1">
                <div className="flex items-center">
                  <div
                    onClick={() => naviagte(-1)}
                    className="cursor-pointer mr-2"
                  >
                    <img src={backbutton} alt="Back" />
                  </div>
                  <h1 className="font-semibold text-sm sm:text-lg uppercase">
                    Order Details
                  </h1>
                </div>
                <div>
                  {(orderData.status === "pending" ||
                    orderData.status === "processing" ||
                    orderData.status === "shipped") && (
                    <button
                      className="border border-white bg-violet-500 flex items-center gap-2 text-white py-2 px-3 font-semibold rounded"
                      onClick={togglecancelModal}
                    >
                      Cancel Order <TiCancel className="mt-1 text-red-500" />
                    </button>
                  )}
                  {orderData.status === "delivered" && (
                    <div>
                      <p className="text-orange-500">Click here to Return</p>
                    </div>
                  )}
                </div>
              </div>
              {/* price Id, and Product Details placement dates and other informations */}
              <div className="bg-white shadow-xl p-2 border border-violet-400 rounded-md mt-3">
                <div className="sm:flex items-center justify-between">
                  <div>
                    <h1 className="sm:text-lg font-bold">
                      # {orderData.orderId || orderData.id}
                    </h1>
                    <p className="font-bold text-blue-400">
                      {orderData.totalQuantity} pieces
                    </p>
                    <p>
                      {"Order will be placed in"}{" "}
                      {date.format(new Date(orderData.createdAt), "DD-MM-YYYY")}
                    </p>
                  </div>
                  <h1 className="text-2xl font-bold">
                    {orderData.totalPrice} ₹
                  </h1>
                </div>
              </div>
              {/* delivery date and status */}
              <div className="px-5 p-5 border-b flex gap-2 sm:gap-2item-center justify-between">
                <div>
                  {<OrderDates orderData={orderData} />}
                  <p className="text-violet-500 font-bold">
                    {modifyPaymentText(orderData.paymentMode)}
                  </p>
                </div>
                <div className="3rd column">
                  <StatusComponent status={orderData.status} />
                </div>
              </div>
              <div className="px-5 w-full border-b mt-3">
                <h1 className="text-lg font-bold pb-3">
                  Products <span className="">({orderData.totalQuantity})</span>
                </h1>
              </div>
              <div>
                <div className="overflow-x-auto border--t">
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <td className="font-bold py-2 px-1 w-4/12">Products</td>
                        <td className="py-2 px-1 font-bold w-1/12">Price</td>
                        <td className="font-bold py-2 px-1 w-1/12">Quantity</td>
                        <td className="font-bold py-2 px-1 w-1/12">
                          Sub-Total
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.products &&
                        orderData.products.map((item, index) => (
                          <OrderDetailsProductRow
                            index={index}
                            item={item}
                            length={orderData.products.length}
                            key={index}
                            status={orderData.status}
                            toggleReviewModal={toggleReviewModal}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="lg:flex w-full pt-8  sm:flex-col">
                  <div className="sm:flex-col p-12 flex items-end  bg-gray-50">
                    <div className="gap-10">
                      <p className="font-bold text-violet-500">subTotal</p>
                      <p>{orderData.subTotal}</p>
                      <p className="font-bold text-violet-500">Shipping</p>
                      <p>{orderData.shipping === 0 ? "Free" : ""}</p>
                      <p className="font-bold text-violet-500">Discount</p>
                      <p>{orderData.discount || 0}</p>
                      <p className="cart-total-li-first">Tax</p>
                      <p className="cart-total-li-second">{orderData.tax}₹</p>
                      <p className="font-semibold text-gray-500">Total</p>
                      <p className="font-semibold">{orderData.totalPrice}₹</p>
                    </div>
                  </div>
                </div>
                {orderData.statusHistory &&
                  (orderData.status === "pending" ||
                    orderData.status === "processing" ||
                    orderData.status === "shipped" ||
                    orderData.status === "delivered") && (
                    <div className="px-5 pt-5 ">
                      <StatusHistoryLoadingBar
                        statusHistory={orderData.statusHistory}
                      />
                    </div>
                  )}
                {orderData && (
                  <div className="pt-5">
                    <YourReview id={id} products={orderData.productId} />
                  </div>
                )}

                <div
                  className=" font-bold lg:flex items-center justify-center gap-10
                "
                >
                  <div className="border-b lg:border-b-0 lg:border-r-2 pr-4">
                    <p className="text-violet-500 font-bold text-xl pb-4">
                      Billing Address
                    </p>
                    {orderData.address && (
                      <OrderHistoryAddress
                        address={orderData.address}
                        title="Billing Address"
                      />
                    )}
                  </div>

                  <div className="border-b lg:border-b-0  pr-4">
                    <p className="text-violet-500 font-bold text-xl pb-4">
                      Shipping Address
                    </p>
                    {orderData.address && (
                      <OrderHistoryAddress
                        address={orderData.address}
                        title="Billing Address"
                      />
                    )}
                  </div>
                </div>
                <div className="lg:w-1/3 p-5">
                  <h1 className="font-bold">Order Notes</h1>
                  <p className="text-black">
                    {orderData.additionalNotes || "Not Added"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
