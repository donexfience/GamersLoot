import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews } from "../../../../redux/actions/user/uesrReviewAction";

const YourReview = ({ id, products }) => {
  const dispatch = useDispatch();
  const { reviews, error, loading } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getReviews(id));
  }, []);

  return (
    <div className="bg-white rounded-lg p-5 mt-5">
      <div className="flex gap-2 items-center">
        <h1 className="text-lg font-semibold">Your Reviews</h1>
      </div>
      {/* finding existed review for passing it into edit modal in reviewrow */}
      {reviews && reviews.length > 0 ? (
        reviews.map((item, index) => {
          let product = [];
          if (products && products.length > 0) {
            product = products.find(
              (exist) => exist.productId._id === item.product
            );
          }

          return <ReviewRow review={item} key={index} product={product} />;
        })
      ) : (
        <p>{error || "You haven't have any past reviewed of this product"}</p>
      )}
    </div>
  );
};

export default YourReview;
