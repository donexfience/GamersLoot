import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Logo from "../../assets/LOGO.png";
import { GoogleLogin } from "@react-oauth/google";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import CustomSingleFileInput from "../../components/CustomSingleFileInput";
import SignupBg from "../../assets/SignupBg.jpg";
import toast from "react-hot-toast";
import InputWithIcon from "../../components/InputWithIcon";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

import {    
  AiOutlineLock,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import { commonRequests } from "../../Common/api";
import {
  googleLoginOrSignUp,
  signUpUser,
} from "../../redux/actions/userActions";
import PasswordInputWithIcon from "../../components/PasswordInputWithIcon";
import { Link, useNavigate } from "react-router-dom";
import { updateError } from "../../redux/reducers/user/userSlice";
import { appJson, config, configMultiPart } from "../../Common/configurations";
import OTPEnterSection from "./register/OTPEnterSection";
import OTPExpired from "./components/OTPExpired";

const Signup = () => {
  const override = css`
  display: block;
  margin: 0 auto;
`;

  const { user, loading, error } = useSelector((state) => state.user);
  const [emailSec, setEmailSec] = useState(true);
  const [otpLoading, setOTPLoading] = useState(false);
  const [otpSec, setOTPSec] = useState(false);
  const [otpExpired, setOTPExpired] = useState(false);
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordAgain: "",
    phoneNumber: "",
    profileImgURL: null,
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user]);
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must contain 8 Characters, One UpperCase, One Number and One Special Case Character"
      ),
    passwordAgain: Yup.string()
      .required("Password is required")
      .oneOf(
        [Yup.ref("password"), null],
        "Password doesn't match with original"
      ),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(99999999),
  });
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const dispatchSignup = () => {
    console.log(data,'........')
    let formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("passwordAgain", data.passwordAgain);
    formData.append("phoneNumber", data.phoneNumber);
    if (data.profileImgURL) {
      formData.append("profileImgURL", data.profileImgURL);
    }
    console.log("---------------------------------------------",data)

    dispatch(signUpUser(formData));
  };
  // Google Login
  const loginWithGoogle = async (data) => {
    dispatch(googleLoginOrSignUp(data));
  };

  const handleRegister = async (value) => {
    //displaying the loading
    setOTPLoading(true);
    setData(value);
    if (value.email.trim() === "") {
      toast.error("Enter the email");
      return;
    }
    const res = await commonRequests(
      "POST",
      "/auth/send-otp",
      { email: value.email },
      configMultiPart
    );
    //if we get the otp from backend we updating states opening modals
    if (res.success) {
      console.log(res, "signup");
      setEmailSec(false);
      setOTPSec(true);
      setOTPLoading(false);
      toast.success("OTP SENT SUCCESSFULLY");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      toast.error(res.response.data.error);
      setOTPLoading(false);
    }
  };

  return (
    <div className="py-20 bg-white lg:flex  lg:items-center text-gray-500">
      <div className="lg:w-1/2">
        <img src={SignupBg} alt="ForgotBG" />
      </div>
      <div className="lg:w-1/2 p-5 mx-10 lg:mx-20 lg:p-10 ">
        <div className="flex items-center flex-col">
          <img src={Logo} alt="gamersLoot. logo" className="lg:w-1/12 w-1/12" />
          <p className="text-3xl font-bold">GamersLoot</p>
          <div>
            <h1 className="text-2xl my-5 font-bold">Create an account</h1>
          </div>
        </div>
        {emailSec && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ values, setFieldValue }) => (
              <Form className="w-full mb-4">
                <div className="flex justify-center mb-4">
                  <CustomSingleFileInput
                    onChange={(file) => {
                      setFieldValue("profileImgURL", file);
                      console.log(file,'1111111111111111111111111111111111111');
                    }}
                  />
                  <ErrorMessage
                    className="text-sm text-red-500"
                    name="profileImgURL"
                    component="span"
                  />
                </div>
                <InputWithIcon
                  name="firstName"
                  placeholder="Enter your First Name"
                  icon={<AiOutlineUser />}
                />
                <InputWithIcon
                  name="lastName"
                  placeholder="Enter Your Last Name"
                  icon={<AiOutlineUser />}
                />
                <InputWithIcon
                  name="email"
                  placeholder="Enter Your email"
                  icon={<AiOutlineMail />}
                />
                <PasswordInputWithIcon
                  icon={<AiOutlineLock />}
                  title="Password"
                  name="password"
                  placeholder="Enter your password"
                />
                <PasswordInputWithIcon
                  icon={<AiOutlineLock />}
                  title="passwordAgain"
                  name="passwordAgain"
                  placeholder="Confirm your password"
                />
                <InputWithIcon
                  name="phoneNumber"
                  placeholder="Enter Your Phone Number"
                  icon={<AiOutlinePhone />}
                />
                <button
                  className="bg-violet-500 text-white py-2 px-4 mt-2 rounded-md hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-400 w-full"
                  disabled={otpLoading}
                  type="submit"
                >
                  {otpLoading ? (
                    <ClipLoader
                      css={override}
                      size={20}
                      color={"#ffffff"}
                      loading={true}
                    />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        )}
        {otpSec && (
          <OTPEnterSection
            email={data.email}
            setOTPExpired={setOTPExpired}
            setOTPSec={setOTPSec}
            dispatchSignup={dispatchSignup}
          />
        )}
        {otpExpired && <OTPExpired />}
        <div className="text-center">
          <p className="my-4">OR</p>
          {/* google authentication */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                loginWithGoogle(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
                toast.error("Something is wrong! Please try later");
              }}
            />
          </div>
          <p className="my-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold cursor-pointer hover:text-black"
            >
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
