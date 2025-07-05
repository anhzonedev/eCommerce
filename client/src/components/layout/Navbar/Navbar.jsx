import React, { useContext, useEffect } from "react";
import { assets } from "../../../assets/assets";
import { Link, NavLink } from "react-router-dom";
import {
  FaSearch,
  FaRegUserCircle,
  FaRegHeart,
  FaShoppingCart,
  FaRegUser,
} from "react-icons/fa";
import { IoLogOutOutline, IoLogInOutline } from "react-icons/io5";
import MenuNavbar from "./components/MenuNavbar";
import { AppContext } from "../../../context/AppContext";
import SearchBar from "../../ui/SearchBar";
const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  return (
    <div className="w-full bg-white border-b-1 border-gray-200 mb-8">
      <div className="max-w-[1350px] mx-auto">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-between gap-6 w-full h-[60px] py-2">
            <div>
              <Link
                to={"/"}
                className="flex items-center justify-center gap-2 w-auto cursor-pointer"
              >
                <img
                  src={assets.logo}
                  className="w-[60px] h-[60px] object-cover"
                  alt=""
                />
                <p className="font-bold text-xl tracking-widest bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  ZENMART
                </p>
              </Link>
            </div>

            <SearchBar />

            <div className="flex items-center justify-center gap-6">
              <div className="relative group">
                <div
                  className={`w-[40px] h-[40px] overflow-hidden flex items-center justify-center rounded-full text-primary cursor-pointer group-hover:text-white transition-all duration-500 ease-in-out group-hover:bg-primary ${
                    user ? "border-primary border-2" : "bg-primary/20"
                  }`}
                >
                  {user ? (
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${user.username}`
                      }
                      alt="User"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                  ) : (
                    <FaRegUserCircle />
                  )}
                </div>

                <div className="absolute p-4 right-0 top-full mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right">
                  {user ? (
                    <>
                      <div className="flex flex-col justify-center items-start gap-1">
                        <p className="text-sm font-semibold text-gray-700">
                          Chào mừng! {user.name}
                        </p>
                        <span className="block border-b-1 w-full h-1 border-gray-300"></span>
                      </div>
                      <div className="p-2">
                        <Link
                          to={"/profile"}
                          className="flex items-center justify-start gap-2 py-2 text-sm text-gray-700 hover:text-primary/80 transition-all duration-500 hover:translate-x-2"
                        >
                          <FaRegUser />
                          Tài khoản
                        </Link>
                        <Link
                          onClick={() => logout()}
                          className="flex items-center justify-start gap-2 py-2 text-sm text-gray-700 hover:text-primary/80 transition-all duration-500 hover:translate-x-2"
                        >
                          <IoLogOutOutline />
                          Đăng xuất
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={"/login"}
                      className="flex items-center justify-start gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary/80 transition-all duration-500 hover:translate-x-2"
                    >
                      <IoLogInOutline />
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>

              <div className="w-[40px] h-[40px] overflow-hidden bg-primary/20 flex items-center justify-center rounded-full text-primary cursor-pointer group hover:text-white transition-all duration-500 ease-in-out hover:bg-primary">
                <FaRegHeart />
              </div>

              <div className="w-[40px] h-[40px] overflow-hidden bg-primary/20 flex items-center justify-center rounded-full text-primary cursor-pointer group hover:text-white transition-all duration-500 ease-in-out hover:bg-primary">
                <FaShoppingCart />
              </div>
            </div>
          </div>
          <MenuNavbar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
