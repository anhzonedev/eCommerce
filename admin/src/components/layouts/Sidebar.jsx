import React from "react";
import { Link } from "react-router-dom";
import { Divider, Menu } from "antd";
import { MdDashboardCustomize } from "react-icons/md";
import { FaRegUser, FaProductHunt } from "react-icons/fa";
const Sidebar = () => {
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <MdDashboardCustomize />,
      children: [
        {
          key: "dashboard",
          label: <Link to="/admin">Dashboard</Link>,
          icon: <MdDashboardCustomize />,
        },
        {
          key: "users",
          label: <Link to="/admin/users">Quản lý tài khoản</Link>,
          icon: <FaRegUser />,
        },
        {
          key: "products",
          label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
          icon: <FaProductHunt />,
        },
        {
          key: "banners",
          label: <Link to="/admin/banners">Quản lý Banners</Link>,
          icon: <FaProductHunt />,
        },
        {
          key: "categories",
          label: "Quản lý danh mục",
          icon: <FaProductHunt />,
          children: [
            {
              key: "parent-categories",
              label: <Link to="/admin/categories">Quản lý danh mục</Link>,
              icon: <FaProductHunt />,
            },
            {
              key: "create-categories",
              label: <Link to="/admin/create-category">Thêm mới danh mục</Link>,
              icon: <FaProductHunt />,
            },
            {
              key: "create-sub-categories",
              label: (
                <Link to="/admin/add-subcategory">Thêm mới danh mục con</Link>
              ),
              icon: <FaProductHunt />,
            },
          ],
        },
      ],
    },
    {
      type: "divider",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start bg-white w-full h-full py-6">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="font-extrabold text-3xl text-gray-600 italic">
          Admin Panel
        </h1>
        <p className="text-md text-gray-500">Trang quản trị</p>
      </div>
      <Divider />
      <div className="w-full h-full flex flex-col items-start justify-start gap-2">
        <Menu
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["dashboard"]}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
};

export default Sidebar;
