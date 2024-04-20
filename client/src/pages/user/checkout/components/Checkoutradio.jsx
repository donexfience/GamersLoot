import React from "react";
import { AiFillDelete, AiFillEdit, AiOutlineEdit } from "react-icons/ai";

const Checkoutradio = ({
  selectedAddress,
  setSelectedAddress,
  setEditedAddress,
  item,
  toggleEditAddressModal,
  toggleDeleteAdressModal,
}) => {
  //   const selected = selectedAddress === item._id;
  const selected = false;

  return (
    <div
      className={ `border border-violet-500 shadow-slate-950 bg-white rounded my-1 py-2 px-4 cursor-pointer hover:bg-white flex justify-between${
        selected ? " text-black font-bold" : ""
      }`}
    >
      <div className="flex items-center">
        <p className="line-clamp-1">
          <span>
            <input
              type="radio"
              name="choosed"
              id="choosed"
              checked={selected}
              onChange={(e) => {
                setSelectedAddress(item._id);
              }}
            />
          </span>
          <span className="font font-semibold border-yellow-400 text-violet-500">
            {/* {item.firstName} {item.lastName}
              {" "}
              {item.address} */}
          </span>
        </p>
      </div>
      <div>
        <div className="flex gap-5 items-center justify-center">
          <AiFillEdit
            className="text-xl text-violet-500 hover:text-black"
            onClick={() => {
              setEditedAddress(item);
              toggleEditAddressModal();
            }}
          />
          <AiFillDelete
            className="text-xl text-violet-500 hover:text-black"
            onClick={(e) => toggleDeleteAdressModal(item._id)}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkoutradio;
