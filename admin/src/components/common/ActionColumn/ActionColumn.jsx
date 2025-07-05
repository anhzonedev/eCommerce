
import React from "react";
import { Checkbox, Space, message, Popconfirm } from "antd";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";

const ActionColumn = ({
  record,
  toggleAction,
  viewLink,
  deleteAction,
  toggleField = "isBlocked",
  toggleChecked = (record) => !record[toggleField],
  viewIcon = <FaEye />,
  deleteIcon = <MdDeleteForever />,
  viewBorderColor = "border-green-400",
  viewTextColor = "text-green-600",
  deleteBorderColor = "border-red-400",
  deleteTextColor = "text-red-600",
  deleteTitle = "Xóa bản ghi",
  deleteDescription = "Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.",
}) => {
  return (
    <Space className="flex items-center justify-center" size={14}>
      {toggleAction && (
        <Checkbox
          checked={toggleChecked(record)}
          onChange={(e) => toggleAction(record._id, !e.target.checked)}
        />
      )}
      {viewLink && (
        <button
          className={`text-lg w-[25px] h-[25px] cursor-pointer p-1 border ${viewBorderColor} rounded-sm ${viewTextColor} flex items-center justify-center`}
        >
          <Link
            to={viewLink(record)}
            className="w-full h-full flex items-center justify-center"
          >
            {viewIcon}
          </Link>
        </button>
      )}
      {deleteAction && (
        <Popconfirm
          title={deleteTitle} 
          description={deleteDescription}
          onConfirm={() => deleteAction(record._id)}
          onCancel={() => message.info("Hủy xóa bản ghi")}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <button
            className={`text-lg w-[25px] h-[25px] cursor-pointer p-1 border ${deleteBorderColor} rounded-sm ${deleteTextColor} flex items-center justify-center`}
          >
            {deleteIcon}
          </button>
        </Popconfirm>
      )}
    </Space>
  );
};

export default ActionColumn;