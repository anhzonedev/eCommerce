import React from "react";
import { Table } from "antd";

const CustomTable = ({
  columns,
  dataSource,
  rowKey = "_id",
  loading = false,
  pagination = false,
  fetchUsers,
  ...restProps
}) => {
  const handleTableChange = (pagination) => {
    if (fetchUsers) {
      fetchUsers(pagination.current, pagination.pageSize);
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={
          pagination && {
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["1", "10", "20", "50", "100"],
            showTotal: (total) => `Tổng ${total} mục`,
          }
        }
        onChange={handleTableChange}
        {...restProps}
      />
    </div>
  );
};

export default CustomTable;
