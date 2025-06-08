import React, { useState } from "react";
import UpdateProfile from "../components/UpdateProfile";
import { FaCamera, FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import UpdatePassword from "../components/UpdatePassword";
import AddressList from "../components/AddressList";
import UpdateImage from "../components/UpdateImage";
const MyProfile = () => {
  const [isActive, setIsActive] = useState("profile");

  const renderContent = () => {
    switch (isActive) {
      case "profile":
        return <UpdateProfile />;
      case "password":
        return <UpdatePassword />;
      case "address":
        return <AddressList />;
      default:
        return <UpdateProfile />;
    }
  };
  return (
    <div>
      <main className="max-w-[1350px] mx-auto w-full flex flex-col md:flex-row gap-6 p-20">
        <aside className="bg-white shadow-lg rounded-lg w-full h-auto max-w-xs flex flex-col items-center p-4">
          <UpdateImage />
          <nav className="w-full p-4 flex flex-col gap-2 text-[#0a2540]">
            <NavLink
              onClick={() => setIsActive("profile")}
              className={`rounded flex items-center justify-start gap-6 font-medium py-1 ${
                isActive === "profile" ? "bg-primary text-white" : ""
              }`}
            >
              <div className="transition-transform duration-300 hover:translate-x-1 flex items-center justify-start gap-6 font-medium px-3 py-2 ">
                <FaRegUser />
                Đổi thông tin tài khoản
              </div>
            </NavLink>
            <NavLink
              onClick={() => setIsActive("password")}
              className={`rounded flex items-center justify-start gap-6 font-medium py-1 ${
                isActive === "password" ? "bg-primary text-white" : ""
              }`}
            >
              <div className="transition-transform duration-300 hover:translate-x-1 flex items-center justify-start gap-6 font-medium px-3 py-2 ">
                <FaRegUser />
                Đổi mật khẩu
              </div>
            </NavLink>
            <NavLink
              onClick={() => setIsActive("address")}
              className={`rounded flex items-center justify-start gap-6 font-medium py-1 ${
                isActive === "address" ? "bg-primary text-white" : ""
              }`}
            >
              <div className="transition-transform duration-300 hover:translate-x-1 flex items-center justify-start gap-6 font-medium px-3 py-2 ">
                <FaRegUser />
                Địa chỉ giao hàng
              </div>
            </NavLink>
          </nav>
        </aside>
        <section className="flex-1 flex flex-col gap-6">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default MyProfile;
