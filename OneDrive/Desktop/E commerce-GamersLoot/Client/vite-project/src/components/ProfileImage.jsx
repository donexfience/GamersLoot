import React from "react";
import { URL } from "../Common/api";

const ProfileImage = ({ user, radius }) => {
  const imageRadius = radius || "full";
  if (user.profileImgURL) {
    return (
      <div
        className={`h-full w-full rounded-${imageRadius} shrink-0 overflow-clip`}
      >
        <img
          src={`${URL}/img/${user.profileImgURL}`}
          alt="user-profie"
          className="object-contain w-full h-full"
        />
      </div>
    );
  }
  if (user.profileImgURL) {
    return (
      <div
        className={`h-full w-full rounded-${imageRadius} shrink-0 overflow-clip`}
      >
        <img
          src={`${URL}/img/${user.profileImgURL}`}
          alt="user-profie"
          className="object-contain w-full h-full"
        />
      </div>
    );
  }
  return (
    <div
      className={`w-full h-full bg-gray-100 rounded ${imageRadius} shrink-0`}
    ></div>
  );
};

export default ProfileImage;
