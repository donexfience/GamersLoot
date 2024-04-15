import React from "react";
import { BsCaretRightFill } from "react-icons/bs";

const BreadCrumbs = ({ list }) => {
  return (
    <div>
      <div className="flex ml-5">
        {list.map((li, index) => (
          <div
            className="flex items-center gap-2  mr-2 my-2 text-gray-500"
            key={index}
          >
            <p
              className={`font-semibold ${
                index === list.length - 1 && "text-blue-500"
              }`}
            >
              {li}
            </p>
            {index !== list.length - 1 && <BsCaretRightFill />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadCrumbs;
