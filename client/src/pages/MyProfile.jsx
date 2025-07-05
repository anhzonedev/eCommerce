import React, { useContext, useState } from "react";
import { FaCamera, FaRegUser, FaStore } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import AddressList from "../features/Address/AddressList";
import UpdateProfile from "../features/profile/UpdateProfile";
import UpdatePassword from "../features/profile/UpdatePassword";
import UpdateImage from "../features/profile/UpdateImage";
import Dashboard from "../features/seller/Dashboard";
import { AppContext } from "../context/AppContext";
const MyProfile = () => {
  const [isActive, setIsActive] = useState("profile");
  const { user } = useContext(AppContext);
  const renderContent = () => {
    switch (isActive) {
      case "profile":
        return <UpdateProfile />;
      case "password":
        return <UpdatePassword />;
      case "address":
        return <AddressList />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <UpdateProfile />;
    }
  };

  const baseNavItems = [
    {
      id: "profile",
      label: "Đổi thông tin tài khoản",
      icon: <FaRegUser />,
    },
    {
      id: "password",
      label: "Đổi mật khẩu",
      icon: <FaRegUser />,
    },
  ];

  const addressNavItem = {
    id: "address",
    label: "Địa chỉ giao hàng",
    icon: <FaRegUser />,
  };

  const sellerNavItems = [
    {
      id: "dashboard",
      label: "Quản lý cửa hàng",
      icon: <FaStore />,
    },
    ...baseNavItems,
  ];

  const userNavItems = [...baseNavItems, addressNavItem];

  const navItems = user?.role === "seller" ? sellerNavItems : userNavItems;
  return (
    <div className="bg-[#F6F9FC]">
      <main className="max-w-[1350px] mx-auto w-full flex flex-col md:flex-row gap-6 p-20">
        <aside className="bg-white shadow-lg rounded-lg w-full h-auto max-w-xs flex flex-col items-center p-4">
          <UpdateImage />
          <nav className="w-full p-4 flex flex-col gap-2 text-[#0a2540]">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                onClick={() => setIsActive(item.id)}
                className={`rounded flex items-center justify-start gap-6 font-medium py-1 ${
                  isActive === item.id ? "bg-primary text-white" : ""
                }`}
              >
                <div className="transition-transform duration-300 hover:translate-x-1 flex items-center justify-start gap-6 font-medium px-3 py-2">
                  {item.icon}
                  {item.label}
                </div>
              </NavLink>
            ))}
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
