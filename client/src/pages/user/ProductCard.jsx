import React from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../Common/api";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Calculate the discounted price
  const discountedPrice = product.price - (product.price * product.offer) / 100;

  return (
    <div
      className="relative p-5 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {parseInt(product.offer) > 0 && (
        <div className="absolute top-0 left-0 bg-orange-500 text-white py-1 px-2 rounded-tl-lg rounded-br-lg">
          {product.offer}% OFF
        </div>
      )}
      <div className="overflow-hidden rounded-lg h-56">
        <img
          src={`${URL}/img/${product.imageURL}`}
          alt={product.name}
          className="object-contain w-full h-full"
        />
      </div>
      {product.numberOfReviews > 0 ? (
        <RatingStars
          numberOfReviews={product.numberOfReviews}
          rating={product.rating}
        />
      ) : (
        <div className="h-9"></div>
      )}
      <p className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</p>
      <p className="font-semibold text-md text-blue-500">
        {product.offer ? (
          <>
            <span className="text-gray-500 line-through">
              {product.price}₹
            </span>
            {" "}
          </>
        ) : null}
        {discountedPrice + product.markup}₹ {/* Displaying the discounted price + markup */}
      </p>
    </div>
  );
};

export default ProductCard;
