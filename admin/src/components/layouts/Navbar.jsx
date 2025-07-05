import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Dropdown, Space } from "antd";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { AiOutlineMenuFold } from "react-icons/ai";
import { AppContext } from "../../context/AppContext";

const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useContext(AppContext);

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = [
    {
      key: "profile",
      label: "Hồ sơ",
      icon: <FaUserCircle className="w-[20px] h-[20px]" />,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <TbLogout2 className="w-[20px] h-[20px]" />,
      onClick: () => handleLogout({ key: "logout" }),
    },
  ];

  return (
    <div className="w-full flex items-center">
      <div className="bg-white p-4 w-full flex items-center justify-between">
        <div className="flex items-center justify-center gap-4">
          <div className="w-[30px] h-[30px] cursor-pointer p-1">
            <AiOutlineMenuFold className="w-full h-full" />
          </div>
          <div>
            <Search
              placeholder="Search..."
              onSearch={onSearch}
              style={{ width: 300 }}
            />
          </div>
        </div>
        <div className="rounded-md border border-gray-200 px-4 py-1">
          <div className="w-full flex items-center justify-center gap-4">
            {token ? (
              <div className="flex items-center gap-2">
                <div className="w-[40px] h-[40px] overflow-hidden rounded-full border border-gray-200 flex items-center justify-center bg-gray-100">
                  <FaUserCircle className="w-full h-full text-gray-400" />
                </div>
                <Dropdown
                  menu={{ items }}
                  dropdownRender={(menu) => (
                    <div style={{ marginTop: 14, width: 200 }}>{menu}</div>
                  )}
                >
                  <a>
                    <Space>
                      <h1 className="font-semibold text-sm text-gray-700">
                        Admin
                      </h1>
                      <FaChevronDown className="text-gray-500 text-xs" />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Đăng nhập
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
