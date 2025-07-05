// components/Address/AddressTable.jsx
import { Tooltip } from "antd";
import { FaPen } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import CustomTable from "../../../components/common/Table/CustomTable";

const AddressTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) =>
        `${record.addressLine}, ${record.ward}, ${record.district}, ${record.province}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Mô tả",
      dataIndex: "note",
      key: "note",
      render: (text) => text || "-",
    },
    {
      title: "Hoạt động",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Chỉnh sửa">
            <button
              onClick={() => onEdit(record)}
              className="cursor-pointer border border-gray-300 rounded-md w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#00a65a] hover:border-[#00a65a] transition-colors"
            >
              <FaPen />
            </button>
          </Tooltip>
          <Tooltip title="Xóa">
            <button
              onClick={() => onDelete(record._id)}
              className="cursor-pointer border border-[#ff4d4f] rounded-md w-8 h-8 flex items-center justify-center text-[#ff4d4f] hover:bg-[#ff4d4f] hover:text-white transition-colors"
            >
              <MdDeleteForever />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      rowKey="_id"
    />
  );
};

export default AddressTable;
