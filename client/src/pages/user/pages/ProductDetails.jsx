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
    setCount((count) => count - 1);
  };

  console.log(
    "🚀 ~ file: ProductDetails.jsx:89 ~ ProductDetails ~ ProductImage:",
    ProductImage
  );

  return (
    <div className="px-5 lg:px-40 py-20 bg-white">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <JustLoading size={20} />
        </div>
      ) : product ? (
        <>
          <BreadCrumbs list={["Home", "Product", "ProductDetails"]} />
          <div className="lg:flex gap-5 mt-4">
            {/* image adding div */}
            <div className="lg:w-1/2 border p-5 rounded shadow-2xl bg-white flex  items-center h-fit">
                <div className="border border-green-400">
                    {product.moreImageURL.map((id,img)=>{
                      <div key={id}
                      className=""
                      >

                      </div>
                    })}
                </div>
              <div className="border border-red-200">
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
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductDetails;
