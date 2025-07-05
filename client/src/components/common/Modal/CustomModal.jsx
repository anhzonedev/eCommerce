import React, { useState } from "react";
import { Button, Modal } from "antd";
const CustomModal = ({
  title,
  open,
  onOk,
  onCancel,
  okText = "Xác nhân",
  cancelText = "Hủy",
  children,
}) => {
  return (
    <div>
      <>
        <Modal
          style={{ minWidth: 800, padding: 10, maxWidth: 1000 }}
          title={title}
          open={open}
          onOk={onOk}
          onCancel={onCancel}
          okText={okText}
          cancelText={cancelText}
        >
          {children}
        </Modal>
      </>
    </div>
  );
};

export default CustomModal;
