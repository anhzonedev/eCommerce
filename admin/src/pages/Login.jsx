import React, { useContext, useState } from "react";
import { message } from "antd";
import CustomForm from "../components/common/Form/CustomForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/common/Loader/Loader";

const Login = ({ form }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { backendUrl, setToken } = useContext(AppContext);
  const fields = [
    {
      name: "email",
      label: "Tên đăng nhập",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập tên đăng nhập!" }],
      colSpan: 1,
      placeholder: "Nhập tên đăng nhập",
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      rules: [{ required: true, message: "Vui lòng nhập mật khẩu!" }],
      colSpan: 1,
      placeholder: "Nhập mật khẩu",
    },
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/admin/login`, {
        email: values.email,
        password: values.password,
      });

      if (response.data.success) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        setToken(token);
        message.success(response.data.message);
        navigate("/admin");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-bold text-3xl text-gray-700">
              Đăng nhập hệ thống
            </h1>
            <p className="text-gray-500 mt-2">
              Vui lòng nhập thông tin đăng nhập
            </p>
          </div>
          <div>
            <CustomForm
              form={form}
              fields={fields}
              columns={1}
              onFinish={onFinish}
              submitText="Đăng nhập"
              submitProps={{
                size: "large",
                className: "w-full",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
