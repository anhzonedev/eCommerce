import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../../../context/AppContext";

const MenuNavbar = () => {
  const navLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/about", label: "Về chúng tôi" },
    { path: "/product", label: "Sản phẩm" },
    { path: "/blog", label: "Bài viết" },
    { path: "/contact", label: "Liên hệ" },
  ];

  const { user } = useContext(AppContext);

  return (
    <div className="flex items-center justify-around w-full">
      <ul className="flex items-center justify-center gap-6 p-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "text-base font-medium text-primary"
                : "text-base text-gray-700 font-medium hover:text-primary transition-all duration-300"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </ul>
      {user && user.role === "seller" ? (
        <div className="py-2 px-4 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all duration-300">
          Bạn là người bán
        </div>
      ) : (
        <NavLink
          to="/create-seller"
          className="py-2 px-4 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all duration-300"
        >
          Đăng ký người bán
        </NavLink>
      )}
    </div>
  );
};

export default MenuNavbar;
