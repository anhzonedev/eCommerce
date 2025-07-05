import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="relative flex-1 max-w-[600px] border border-gray-400 rounded-2xl h-12 overflow-hidden focus-within:border-primary focus-within:border-1 mx-4 transition-all duration-500">
      <input
        type="text"
        placeholder="Nhập nội dung tìm kiếm ..."
        className="text-gray-500 text-base py-4 pl-8 pr-14 rounded-2xl w-full h-full border-none outline-none"
      />
      <div className="absolute right-0 top-0 h-full flex items-center justify-center px-6 text-gray-500">
        <FaSearch className="w-5 h-5" />
      </div>
    </div>
  );
};

export default SearchBar;
