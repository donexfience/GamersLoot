import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../../../Common/api";
import { config } from "../../../Common/configurations";
import toast from "react-hot-toast";
import JustLoading from "../../../components/JustLoading";
import BreadCrumbs from "../../admin/components/BreadCrumbs";
import ImageZooming from "../../../components/ImageZooming";
import RatingandReview from "../components/RatingandReview";
import { FaInfoCircle } from "react-icons/fa";
import Quantity from "../components/Quantity";
import { AiFillHeart } from "react-icons/ai";
import RelatedProducts from "../components/RelatedProducts";
import UserReview from "../components/UserReview";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //states for storing product

  const [product, setProdut] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ProductImage, setProductImage] = useState("");

  //fetching data at initial loading

  //function for fetching data

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/user/product/${id}`, {
        withCredentials: true,
      });

      if (data) {
        setProdut(data.product);
        setLoading(false);
        setProductImage(data.product.imageURL);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  //calling loadingData at inital loading
  useEffect(() => {
    loadProduct();
  }, [id]);

  //counter for product quantity

  const [count, setCount] = useState(1);
  const increment = async () => {
    try {
      const { data } = await axios.get(
        `${URL}/user/product/quantity/${id}`,
        { withCredentials: true },
        config
      );
      if (data.stockQuantity > count) {
        setCount((count) => count + 1);
      } else {
        toast.error("Product Unavailable");
      }
    } catch (error) {
      console.log(error, "-----------------");
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount((count) => count - 1);
    }
  };

  console.log(
    "🚀 ~ file: ProductDetails.jsx:89 ~ ProductDetails ~ ProductImage:",
    ProductImage
  );

  return (
    <div className="px-5 lg:px-30 py-20 bg-white">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <JustLoading size={20} />
        </div>
      ) : product ? (
        <>
          <BreadCrumbs list={["Home", "Product", "ProductDetails"]} />
          <div className="lg:flex gap-5 mt-7 ">
            {/* image adding div */}
            <div className=" ml-7 lg:w-1/2 bg-white p-5 rounded flex  items-center ">
              <div className=" lg:gap-5 ">
                {product.moreImageURL &&
                  product.moreImageURL.map((image, i) => (
                    <div
                      key={i}
                      className={`flex justify-center items-center w-12 h-12 lg:w-20 lg:h-20 overflow-clip border mt-4 ${
                        ProductImage === image ? "border-violet-500" : ""
                      } hover:border-gray-500 p-2 cursor-pointer `}
                      onClick={() => setProductImage(image)}
                    >
                      <img
                        className="w-full h-full object-contain"
                        key={i}
                        src={`${URL}/img/${image}`}
                      />
                    </div>
                  ))}
              </div>
              <div className="ml-6">
                {ProductImage && (
                  <ImageZooming
                    imageUrl={`${URL}/img/${ProductImage}`}
                    width={500}
                    zoomedValue={820}
                    zoomedWidth={500}
                  />
                )}
              </div>
              <div className="w-80 lg:w-96 lg:h-96 lg:hidden mx-auto">
                {ProductImage && (
                  <img
                    src={`${URL}/img/${ProductImage}`}
                    alt="Product"
                    className="w-60 h-60 object-cover"
                  />
                )}
              </div>
            </div>
            <div className=" lg:w-1/2">
              <h1 className="text-2xl font-bold my-2">{product.name}</h1>
              <div className="rating-status flex">
                {product.numOfReview > 0 && (
                  <RatingandReview
                    numberOfReviews={product.numberOfReviews}
                    rating={product.rating}
                  />
                )}
                <span className="divider font-bold ml-2 mr-2">|</span>
                <span
                  className={`font-semibold capitalize ${
                    product.status === "published" && "text-green-600"
                  } ${product.status === "low quantity" && "text-red-600"}`}
                >
                  {product.status === "published" ? "In Stock" : product.status}
                </span>
              </div>
              <p className="description mt-3 font-semibold text-gray-500">
                {product.description}
              </p>
              <div class="mt-3 ml-2 mr-3 border border-gray-300"></div>
              <p className="font-bold mt-3">
                Category:{" "}
                <span className="font-semibold">
                  {product.category && product.category.name}
                </span>
              </p>
              <p className="text-xl font-semibold my-2">
                <span className="text-blue-600 text-2xl">
                  {product.price + product.markup}₹
                </span>
                {"  "}
                {product.offer && (
                  <>
                    <span className="text-gray-500 text-lg line-through">
                      {parseInt(
                        ((product.price + product.markup) *
                          (product.offer + 100)) /
                          100
                      )}
                      ₹
                    </span>
                    <span className="bg-orange-500 text-white px-3 py-1 ml-5 text-base rounded">
                      {product.offer}% Off
                    </span>
                    <span>
                      {" "}
                      <FaInfoCircle className="text-sm mt-2 " />
                    </span>
                  </>
                )}
              </p>
              {product.attributes &&
                product.attributes.slice(0, 4).map((at, index) => (
                  <div key={index}>
                    <p className="font-bold text-blue-500 text-sm">{at.name}</p>
                    <p className="py-2 px-3 font-bold text-black capitalize rounded bg-white ">
                      {at.value}
                    </p>
                  </div>
                ))}
              <div className="flex my-4 gap-3">
                <Quantity
                  count={count}
                  decrement={decrement}
                  increment={increment}
                />
                <button
                  className="w-full  text-black font-bold border border-black rounded-lg p-2 hover:bg-violet-700 hover:text-white"
                  disabled=""
                >
                  Add to Card
                </button>
              </div>
              <div className="flex">
                <button
                  className="w-full  text-white font-bold border bg-violet-700 border-black rounded-lg p-2 hover:bg-violet-700 hover:text-white"
                  disabled=""
                >
                  Buy now
                </button>
                <div className="border-2 border-gray-500 rounded-lg p-3 ml-3">
                  <AiFillHeart />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <RelatedProducts id={id} />
          </div>
          <div className="border border-red-500">
              <UserReview/>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductDetails;
