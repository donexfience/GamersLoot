import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  getAddress,
} from "../../../../redux/actions/user/addressAction";
import Modal from "../../../../components/Modal";

const AddressCheckout = ({ selectedAddress, setSelectedAddress }) => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  useEffect(() => {
    dispatch(getAddress());
  }, []);

  //setting first adderess as a default one when the page load

  useEffect(() => {
    // if (addresses.length > 0) {
    //   selectedAddress(addresses[0]._id);
    // }
  }, [addresses]);

  //state for displaying createAddressModal
  const [createAddressModal, setCreateAddressModal] = useState(false);

  const toggleCreateAddress = () => {
    setCreateAddressModal(!createAddressModal);
  };

  //deleting modal toggle

  const [deleteAddressModal, setDeleteAddressModal] = useState(false);
  const toggleDeleteAdressModal = (deleteAddressId) => {
    setDeleteAddressModal(!deleteAddressModal);
    setDeletedId(deleteAddressId);
  };

  // backend calling delete address

  const [deletedId, setDeletedId] = useState("");
  const dispatchDeleteAddress = () => {
    dispatch(deleteAddress(deletedId));
  };

  //edit address call

  const [editId, setEditId] = useState("");
  const dispatchEditAddress = () => {
    dispatch(deleteAddress(editId));
  };

  const [EditAddress, setEditAddress] = useState({});
  const [editAddressModal, setEditAddressModal] = useState(false);
  const toggleEditAddress = () => {
    setEditAddressModal(!editAddressModal);
  };

  return <div>
    {createAddressModal && <Modal content={"h"}/>}
  </div>;
};

export default AddressCheckout;
