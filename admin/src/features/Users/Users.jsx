// Users.jsx
import React, { useContext, useEffect, useState } from "react";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { message } from "antd";
import UsersTable from "./components/UsersTable";
import UserFilters from "./components/UserFilters";

const Users = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Đã thay đổi từ 1 lên 10
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isBlocked: "",
  });

  const fetchUsers = async (page = 1, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: pageSize,
          ...filters,
        },
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: response.data.totalUsers,
        }));
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [filters]);

  return (
    <div>
      <BreadcrumbHeader
        title={"Quản lý tài khoản"}
        breadcrumbItems={[{ title: "Users" }]}
      />
      <div className="bg-white p-6 mt-12 rounded-xl">
        <UserFilters filters={filters} setFilters={setFilters} />
        <UsersTable
          data={users}
          loading={loading}
          fetchUsers={fetchUsers}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default Users;
