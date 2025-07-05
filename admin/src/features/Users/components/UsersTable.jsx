import React, { useContext } from "react";
import { Avatar, Tag, Checkbox, Space, message, Popconfirm } from "antd";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import CustomTable from "../../../components/common/Table/CustomTable";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { toggleBlockUser, deleteUser } from "../../../utils/userActions.js";
import ActionColumn from "../../../components/common/ActionColumn/ActionColumn.jsx";
const UsersTable = ({ data, loading, fetchUsers, pagination }) => {
  const { backendUrl, token } = useContext(AppContext);
  const handleToggleBlock = (userId, isBlocked) => {
    toggleBlockUser(userId, isBlocked, backendUrl, token, fetchUsers);
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId, backendUrl, token, fetchUsers);
  };
  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar, record) => (
        <Avatar
          src={avatar || `https://ui-avatars.com/api/?name=${record.username}`}
          size="large"
          alt={record.username}
        />
      ),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "seller" ? "green" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "volcano" : "green"}>
          {isBlocked ? "Đã khóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <ActionColumn
          record={record}
          toggleAction={handleToggleBlock}
          viewLink={(rec) => `/admin/users/${rec._id}`}
          deleteAction={handleDeleteUser}
          deleteTitle="Xóa tài khoản"
          deleteDescription="Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác."
        />
      ),
    },
  ];
  return (
    <div>
      <CustomTable
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};

export default UsersTable;
