import axios from "axios";
import React, { useState } from "react";
import { URL } from "../../../Common/api";

const UserReview = () => {
  const [descriptionOrReview, setDescriptionOrReview] = useState(true);
  const toggleDesReview = () => {
    setDescriptionOrReview(!descriptionOrReview);
  };

  //To store the data coming frombackend
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [ratingCount, setRatingCount] = useState([]);

  //loading reviews from backend

  const loadReviews=async ()=>{
    try {
      const {data}=await axios.get(`${URL}/user/review/${id}`,{
        withCredentials:true
      })
      setReviews(data.reviews);
      const ratingCount=Array(5).fill(0);
      data.reviews.forEach((review)=>{
        setRatingCount(review.rating);
      })
    } catch (error) {
      
    }
  }

  return <div className="text-black">UserReview</div>;
};

export default UserReview;
