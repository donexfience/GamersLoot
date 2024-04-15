import React from "react";

const SortButton = ({ sort, handleClick }) => {
  const handleChange = (sort, value) => {
    handleClick(sort, value);
  };

  return (
    <div className="{shrink-0 flex gap-2 items-center}">
      <p className="shrink-0 pt-3 text-white ">Sort By :</p>
      <select
        className=" bg-violet-400 border border-violet-500 shadow-xd py-3 rounded-lg text-black font-bold "
        onChange={(e) => {
          handleChange("sort", e.target.value);
        }}
      >
        <option className="hover:bg-gray-200 py-2 px-3 rounded-lg" value="">
          Newest to Oldest
        </option>
        <option
          className="hover:bg-gray-200 py-2 px-3 rounded-lg"
          value="created-desc"
        >
          Oldest to newest
        </option>
        <option
          className="hover:bg-gray-200 py-2 px-3 rounded-lg"
          value="price-asc"
        >
          Price Low to High
        </option>
        <option
          className="hover:bg-gray-200 py-2 px-3 rounded-lg"
          value="price-desc"
        >
          Price High to Low
        </option>
      </select>
    </div>
  );
};

export default SortButton;
