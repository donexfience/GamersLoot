import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Country, State, City } from "country-state-city";
import SearchInput from "./SearchInput";
import { createAddress } from "../../../../redux/actions/user/addressAction";
import InputType from "../../../../components/InputType";

const Addaddress = ({ closeToggle }) => {
  const dispatch = useDispatch();
  const countries = Country.getAllCountries();
  let [states, setStates] = useState([]);
  let [cities, setCities] = useState([]);

  const initialValues = {
    firstName: "",
    lastName: "",
    companyName: "",
    address: "",
    country: "",
    regionState: "",
    city: "",
    pinCode: "",
    email: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    companyName: Yup.string(),
    address: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    regionState: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    pinCode: Yup.number()
      .required("Required")
      .moreThan(99999, "Pin code should be at-least 6 digit")
      .typeError("Pin code should be digits"),
    email: Yup.string().email("Invalid Email"),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number")
      .required("Phone number is required"),
  });

  const handleSubmit = (value) => {
    // console.log(value);
    dispatch(createAddress(value));
  };

  const handleCountrySelect = (country) => {
    const state = State.getStatesOfCountry(country.isoCode);
    setStates(state);
  };
  const handleSelectState = (state) => {
    const city = City.getCitiesOfState(state.countryCode, state.isoCode);
    setCities(city);
  };

  return (
    <div className="bg-white  shadow-2xl overflow-y-hidden h-screen lg:h-auto rounded-lg w-full ">
      <div className="bg-white pt-5 pb-3 px-7 flex items-center justify-between">
        <h1 className="font-bold text-lg text-violet-500">Create your Delivery Address</h1>
        <AiOutlineClose
          className="text-xl cursor-pointer"
          onClick={closeToggle}
        />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="px-7 pb-5">
            <div className="lg:flex gap-5 justify-stretch">
              <InputType
                name="firstName"
                placeholder="Your first name"
                title="First Name"
              />
              <InputType
                name="lastName"
                placeholder="Your last name"
                title="Last Name"
              />
              <InputType
                name="companyName"
                placeholder="Your company name"
                title="Company Name"
                optional={true}
              />
            </div>
            <InputType name="address" placeholder="" title="Address" />
            <div className="lg:flex gap-5 justify-stretch">
              <SearchInput
                onInput={setFieldValue}
                onSelect={handleCountrySelect}
                data={countries}
                title={"Country"}
                placeholder={"Select your country"}
                name={"country"}
              />
              <SearchInput
                onInput={setFieldValue}
                onSelect={handleSelectState}
                data={states}
                title={"State/Region"}
                placeholder={"Select your state"}
                name={"regionState"}
              />
              <SearchInput
                onInput={setFieldValue}
                onSelect={() => {}}
                data={cities}
                title={"City"}
                placeholder={"Select your City"}
                name={"city"}
              />

              <InputType name="pinCode" placeholder="" title="Pin Code" />
            </div>
            <InputType name="email" placeholder="" title="Email" />
            <InputType name="phoneNumber" placeholder="" title="Phone Number" />
            <button type="submit" className="bg-violet-500 px-6  py-3 mt-4 ml-2 rounded-md text-white">
              Save
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Addaddress;
