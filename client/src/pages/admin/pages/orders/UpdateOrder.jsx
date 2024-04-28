import React from "react";
import { useDispatch } from "react-redux";
import {
  getPassedDateOnwardDateForInput,
  getTodayOnwardDateForInput,
} from "../../../../Common/Functions";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { updateOrderStatus } from "../../../../redux/actions/admin/orderAction";

const UpdateOrder = ({ toggleModal, datas }) => {
  const dispatch = useDispatch();
  const { id, status, paymentMode, deliveryDate } = datas;
  const orderdDate = getPassedDateOnwardDateForInput(deliveryDate);
  console.log(orderdDate, "=========");
  const todyDate = getTodayOnwardDateForInput();

  const initialValues = {
    date: "",
    status: status,
    description: "",
    paymentStatus: "",
  };
  const validationSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
    date: Yup.date().nullable().required("Date is required"),
    description: Yup.string(),
    paymentStatus: Yup.string().nullable(),
  });
  const handleSubmit = (values) => {
    if (values.status !== "delivered" && values.paymentStatus === "") {
      delete values.paymentStatus;
    }
    dispatch(updateOrderStatus({ id, formData: values })).then(() => {
      toggleModal({});
    });
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="w-full">
            <div className="flex items-center justify-between">
              <h1 className="font-bold ">Update Order</h1>
              <AiOutlineClose
                className="font-bold cursor-pointer tex-xl"
                onClick={toggleModal}
              />
            </div>
            <div className="py-2">
              <p>Status</p>
              <Field
                as="select"
                name="status"
                className="capitalize px-5 py-2 w-full bg-white shadow-md rounded-lg"
                disabled={status === "delivered"} // Disable the select field if status is "delivered"
              >
                <option
                  value="pending"
                  disabled={
                    status === "pending" ||
                    status === "processing" ||
                    status === "shipped" ||
                    status === "delivered"
                  }
                >
                  Pending
                </option>
                <option
                  value="processing"
                  disabled={
                    status === "processing" ||
                    status === "shipped" ||
                    status === "delivered"
                  }
                >
                  Processing
                </option>
                <option
                  value="shipped"
                  disabled={status === "shipped" || status === "delivered"}
                >
                  Shipped
                </option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                {/* <option value="returned">Returned</option> */}
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500"
              />
            </div>
            {values.status === "delivered" &&
              paymentMode === "cashOnDelivery" && (
                <div key={values.status}>
                  <p>payment Collected or Not</p>
                  <Field
                    as="select"
                    name="paymentStatus"
                    className="w-full px-5 py-2 border rounded-lg shadow-lg"
                  >
                    <option value="">choose Yes or No</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Field>
                  <ErrorMessage
                    name="paymentStatus"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              )}
            <div className="py-2">
              <p>Date</p>
              <Field
                type="date"
                name="date"
                min={orderdDate}
                max={todyDate}
                className="px-5 py-2 w-full shadow-md border  rounded-lg"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="py-2">
              <p>Description</p>
              <Field
                type="text"
                name="description"
                as="textarea"
                className="px-5 py-2 w-full shadow-md border rounded-lg"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />
            </div>
            <button
              type="submit"
              className="bg-violet-500 p-3 rounded-md text-white font-bold"
            >
              update
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateOrder;
