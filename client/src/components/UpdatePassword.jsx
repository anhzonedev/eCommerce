import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import Loader from "./Loader";
const UpdatePassword = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/auth/change-pass`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading && <Loader />}
      <section
        aria-label="Change Password"
        className="bg-white rounded-lg p-6 shadow-sm max-w-full w-full"
      >
        <h2 className="text-[#0a2540] font-semibold text-sm border-b border-gray-200 pb-2 mb-4">
          Change Password
        </h2>
        <Form
          name="basic"
          className="flex flex-col gap-4 max-w-full"
          labelCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            className="flex flex-col gap-1"
            label="Mật khẩu cũ"
            name="currentPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className="flex flex-col gap-1"
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" className="!bg-primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
};

export default UpdatePassword;
