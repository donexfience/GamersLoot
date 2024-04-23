import React, { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../../components/Modal";
import ProfileImage from "../../../components/ProfileImage";
import InputWithIcon from "../../../components/InputWithIcon";
import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { RiCalendarEventFill } from "react-icons/ri";
import { getPassedDateOnwardDateForInput } from "../../../Common/Functions";
import { TiTick } from "react-icons/ti";
import EditProfiile from "./EditProfiile";
import { ErrorMessage, Field } from "formik";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const toggleEditProfile = () => {
    setShowEditProfileModal(!showEditProfileModal);
  };

  return (
    <>
      {showEditProfileModal && (
        <Modal content={<EditProfiile closeToggle={toggleEditProfile} />} />
      )}
      <div className="bg-white shadow-md p-20">
        <h1 className="p-5 font-bold text-md text-violet-500">
          Profile Details
        </h1>
        {!showEditProfileModal && (
          <div className="w-full">
            <div className="lg:flex items-start gap-5 p-5">
              <div className="w-56 h-56 object-cover rounded-full">
                <ProfileImage user={user} />
              </div>
              <div className="w-3/4">
                <div className="lg:grid grid-cols-2 gap-5 ">
                  <div className="mb-4 mt-5">
                    <p>
                      <label
                        htmlFor="username"
                        className="text-violet-500 pt-4 font-bold"
                      >
                        First Name
                      </label>
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {<AiOutlineUser />}
                      </div>
                      <input
                        className="appearance-none block w-full bg-white text-gray-700 border-b border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:bg-white focus:border-indigo-500"
                        name={user?.firstName || "-"}
                        placeholder="your Name"
                        autoComplete="username"
                        value={user?.firstName}
                      />
                    </div>
                    <p>
                      <label
                        htmlFor="username"
                        className="text-violet-500 pt-4 font-bold"
                      >
                        Last Name
                      </label>
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {<AiOutlineUser />}
                      </div>
                      <input
                        className="appearance-none block w-full bg-white text-gray-700 border-b border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:bg-white focus:border-indigo-500"
                        name={user?.firstName || "-"}
                        placeholder="your Name"
                        autoComplete="username"
                        value={user?.lastName}
                      />
                    </div>
                    <p>
                      <label
                        htmlFor="username"
                        className="text-violet-500 pt-4 font-bold"
                      >
                        Email Address
                      </label>
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {<AiOutlineUser />}
                      </div>
                      <input
                        className="appearance-none block w-full bg-white text-gray-700 border-b border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:bg-white focus:border-indigo-500"
                        name={user?.firstName || "-"}
                        placeholder="your Name"
                        autoComplete="username"
                        value={user?.email}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/4">
                <p className="font-bold text-violet-500 pt-4">Phone Number</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {<AiOutlineUser />}
                  </div>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border-b border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:bg-white focus:border-indigo-500"
                    name={user?.firstName || "-"}
                    placeholder="your Name"
                    autoComplete="username"
                    value={user?.phoneNumber}
                  />
                </div>
                <p className="font-bold text-violet-500 pt-4">Date Of Birth</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {<AiOutlineUser />}
                  </div>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border-b border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:bg-white focus:border-indigo-500"
                    name={user?.firstName || "-"}
                    placeholder="your Name"
                    autoComplete="username"
                    value={user?.dateOfBirth}
                  />
                </div>
                <button
                  className="bg-violet-500 p-2 mt-7 text-white rounded-md "
                  onClick={toggleEditProfile}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
