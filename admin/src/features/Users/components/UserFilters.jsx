
import React from "react";
import { Input, Select, Space, Button } from "antd";
const { Search } = Input;

const UserFilters = ({ filters, setFilters }) => {
  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleRoleChange = (value) => {
    setFilters((prev) => ({ ...prev, role: value }));
  };

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, isBlocked: value }));
  };

  const handleReset = () => {
    setFilters({ search: "", role: "", isBlocked: "" });
  };

  return (
    <Space size="middle" wrap className="mb-4">
      <Search
        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
        onSearch={handleSearch}
        enterButton
        allowClear
        defaultValue={filters.search}
      />
      <Select
        placeholder="Chọn vai trò"
        onChange={handleRoleChange}
        value={filters.role || undefined}
        style={{ width: 140 }}
        allowClear
      >
        <Select.Option value="user">Người dùng</Select.Option>
        <Select.Option value="seller">Người bán</Select.Option>
      </Select>
      <Select
        placeholder="Trạng thái"
        onChange={handleStatusChange}
        value={filters.isBlocked || undefined}
        style={{ width: 140 }}
        allowClear
      >
        <Select.Option value="false">Hoạt động</Select.Option>
        <Select.Option value="true">Đã khóa</Select.Option>
      </Select>
      <Button onClick={handleReset}>Đặt lại</Button>
    </Space>
  );
};

export default UserFilters;
