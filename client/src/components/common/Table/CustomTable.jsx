import React from 'react'
import { Table } from "antd";
const CustomTable = ({
  columns,
  dataSource,
  rowKey = "_id",
  loading = false,
  pagination = false,
  ...restProps
}) => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        {...restProps}
      />
    </div>
  );
};

export default CustomTable