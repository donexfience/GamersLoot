import { Formik, useFormikContext } from "formik";
import React, { useState } from "react";
import { AiFillStar, AiOutlineClose, AiOutlineStar } from "react-icons/ai";

//start priniting function

const starRating = () => {
  const { setFieldValue } = useFormikContext();
  const [rating, setRating] = useState(0);
  const handleStatClick = (value) => {
    setRating(value);
    setFieldValue("rating", value);
  };

  const PrintStarts = () => {
    var stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          onClick={() => handleStatClick(i)}
          className={`cursor-pointer text-xl mr-1 ${
            i <= rating ? "text-yellow-500" : "text-gray-100"
          }`}
        >
          {i <= rating ? <AiFillStar /> : <AiOutlineStar />}
        </span>
      );
    }
    return stars;
  };
  return <div className="flex">{PrintStarts()}</div>;
};
const ProductReview = ({ closeToggle, id, reviewProduct }) => {
  return (
    <div className="bg-white w-5/6 lg:w-2/6 shadow-xl overflow-y-auto rouded-lg">
      <div className="bg-white pt-5 pb-5 px-5 flex items-center justify-between">
        <h1 className="font-bold text-lg">Write a Review</h1>
        <AiOutlineClose
          className="text-xl cursor-pointe"
          onClick={closeToggle}
        />
      </div>
      <div className="px-5 pt-5 flex items-center gap-5">
        <div className="w-10 h-10 overflow-clip flex justify-center items-center shrink-0">
          {reviewProduct.imageURL ? (
            <img
              src={`${URL}/img/${reviewProduct.imageURL}`}
              alt="img"
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="w-10 h-1w-10 bg-slate-300 rounded-md"></div>
          )}
        </div>
        <div>
          <p className="lg:text-lg font-semibold line-clamp-1">
            {reviewProduct.name}
          </p>
        </div>
      </div>
      <div className="p-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <label htmlFor="rating">
              <p>Rating</p>

              <Field name="rating" as={starRating} />
              <ErrorMessage
                className="text-sm text-red-500"
                name="rating"
                component="span"
              />
            </label>
            <label htmlFor="title">
              <p className="mt-3">Title</p>
              <Field
                name="title"
                className="w-full py-2 px-5 rounded mt-2"
                placeholder="Write down your review Title"
              />
              <ErrorMessage
                className="text-sm text-red-500"
                name="title"
                component="span"
              />
            </label>
            <label htmlFor="body">
              <p className="mt-3">Feedback</p>

              <Field
                name="body"
                as="textarea"
                className="h-36 lg:h-52 w-full p-5 rounded mt-2"
                placeholder="Write down your feedback about our product & services"
              />
              <ErrorMessage
                className="text-sm text-red-500"
                name="body"
                component="span"
              />
            </label>
            <button className="btn-blue text-white w-full mt-3" type="submit">
              Publish Review
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ProductReview;
