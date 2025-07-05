import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Upload } from "antd";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loader from "../../components/common/Loader/Loader";

const UpdateProfile = () => {
  const { backendUrl, token, user, setUser } = useContext(AppContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendUrl}/auth/update-profile`,
        {
          username: values.username,
          phone: values.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const updatedUser = {
          ...user,
          name: response.data.account.name,
          phone: response.data.account.phone,
        };
        localStorage.setItem("account", JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(response.data.message);
        setTimeout(() => {
          window.location.reload("/profile");
        }, 1000);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật thông tin"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading && <Loader />}
      <section
        aria-label="Profile Info"
        className="bg-white rounded-lg p-6 shadow-sm max-w-full w-full"
      >
        <h2 className="text-[#0a2540] font-semibold text-sm border-b border-gray-200 pb-2 mb-4">
          Profile Info
        </h2>
        <Form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full"
          form={form}
          labelCol={{ span: 24 }}
          onFinish={onFinish}
        >
          <div className="col-span-2">
            <Form.Item label="Tên của bạn" name="username">
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 số!",
                },
              ]}
            >
              <Input placeholder="0123456789" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className="!bg-primary hover:bg-primary/30"
              type="primary"
              htmlType="submit"
            >
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
};

export default UpdateProfile;
