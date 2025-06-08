import React, { useContext, useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { FaFacebookF, FaGoogle, FaTwitter, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Loader from "../components/Loader";
const Login = () => {
  const [state, setState] = useState("Login");
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl, setUser } = useContext(AppContext);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (state === "Login") {
        const response = await axios.post(`${backendUrl}/user/login`, {
          email: values.email,
          password: values.password,
        });
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
          message.success(response.data.message);
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          message.error(response.data.message);
        }
      }
      if (state === "Register") {
        const response = await axios.post(`${backendUrl}/user/register`, {
          username: values.username,
          phone: values.phone,
          email: values.email,
          password: values.password,
        });
        if (response.data.success) {
          setEmail(values.email);
          setState("VeryOtp");
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      }
      if (state === "VeryOtp") {
        const response = await axios.post(`${backendUrl}/auth/verify-email`, {
          email,
          otp: values.otp,
        });
        if (response.data.success) {
          message.success(response.data.message);
          if (purpose === "forgotPass") {
            setState("ResetPass");
          } else {
            setState("Login");
          }
        } else {
          message.error(response.data.message);
        }
      }
      if (state === "ForgotPass") {
        const response = await axios.post(
          `${backendUrl}/auth/forgot-password`,
          {
            email: values.email,
          }
        );
        if (response.data.success) {
          message.success(response.data.message);
          setEmail(values.email);
          setPurpose("forgotPass");
          setState("VeryOtp");
        } else {
          message.error(response.data.message);
        }
      }
      if (state === "ResetPass") {
        const response = await axios.post(
          `${backendUrl}/auth/update-password`,
          {
            email,
            newPassword: values.password,
          }
        );

        if (response.data.success) {
          message.success(response.data.message);
          setState("Login");
        } else {
          message.error(response.data.message);
        }
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
  const onChange = (text) => {
    console.log("onChange:", text);
  };
  const onInput = (value) => {
    console.log("onInput:", value);
  };
  const sharedProps = {
    onChange,
    onInput,
  };
  return (
    <>
      <div className="max-w-[1200px] mx-auto p-6 mb-30 mt-15">
        <div className="flex items-center justify-center">
          <div className="bg-white shadow h-auto min-w-[800px] flex flex-col items-center justify-center p-8 rounded-xl">
            <Form
              labelCol={{ span: 24 }}
              name="login"
              className="w-[700px]"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <div className="flex flex-col items-center justify-center mb-6 gap-2">
                {state === "Login" ? (
                  <>
                    <h1 className="text-center text-4xl font-bold text-primary">
                      Đăng nhập
                    </h1>
                    <p className="text-gray-500">Chào mừng bạn trở lại</p>
                  </>
                ) : state === "Register" ? (
                  <>
                    <h1 className="text-center text-4xl font-bold text-primary">
                      Đăng ký
                    </h1>
                    <p className="text-gray-500">Tạo tài khoản miễn phí</p>
                  </>
                ) : state === "VeryOtp" ? (
                  <>
                    <h1 className="text-center text-4xl font-bold text-primary">
                      Xác thực OTP
                    </h1>
                    <p className="text-gray-500">
                      Nhập mã OTP được gửi đến emaim của bạn
                    </p>
                  </>
                ) : state === "ForgotPass" ? (
                  <>
                    <h1 className="text-center text-4xl font-bold text-primary">
                      Quên mật khẩu
                    </h1>
                    <p className="text-gray-500">
                      Nhập Email xác thực tài khoản
                    </p>
                  </>
                ) : (
                  state === "ResetPass" && (
                    <>
                      <h1 className="text-center text-4xl font-bold text-primary">
                        Mật khẩu mới
                      </h1>
                      <p className="text-gray-500">Nhập mật khẩu mới</p>
                    </>
                  )
                )}
              </div>

              <div className={`grid grid-cols-2 gap-x-4 gap-y-1`}>
                {state === "Register" && (
                  <>
                    <div className="col-span-2">
                      <Form.Item
                        label="Tên của bạn"
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ của bạn!",
                          },
                        ]}
                      >
                        <Input placeholder="Họ" />
                      </Form.Item>
                    </div>
                  </>
                )}
                {(state === "Login" ||
                  state === "Register" ||
                  state === "ForgotPass") && (
                  <div
                    className={`${
                      (state === "Login" || state === "ForgotPass") &&
                      "col-span-2"
                    }`}
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email của bạn!",
                        },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                  </div>
                )}

                {state === "Register" && (
                  <div>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[
                        { required: true, message: "Vui lòng nhập số điện !" },
                      ]}
                    >
                      <Input placeholder="Số điện thoại" />
                    </Form.Item>
                  </div>
                )}
                {(state === "Login" ||
                  state === "Register" ||
                  state === "ResetPass") && (
                  <div className="col-span-2">
                    <Form.Item
                      label="Mật khẩu"
                      name="password"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                      ]}
                    >
                      <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>
                  </div>
                )}

                {state === "VeryOtp" && (
                  <div className="col-span-2 flex justify-center items-center">
                    <Form.Item
                      label="Mã OTP"
                      name="otp"
                      rules={[
                        { required: true, message: "Vui lòng nhập mã OTP!" },
                      ]}
                      className="mb-0 w-full max-w-[250px]"
                    >
                      <Input.OTP
                        className="!w-full"
                        formatter={(str) => str.toUpperCase()}
                        {...sharedProps}
                      />
                    </Form.Item>
                  </div>
                )}

                <div
                  className={`${
                    state === "Login" ? "" : "col-span-2 row-start-4"
                  }`}
                >
                  <Form.Item
                    name="remember"
                    className="!my-2"
                    valuePropName="checked"
                  >
                    <Checkbox>
                      {state === "Login"
                        ? "Ghi nhớ tài khoản"
                        : "Tôi đồng ý với các điều khoản dịch vụ"}
                    </Checkbox>
                  </Form.Item>
                </div>

                {state === "Login" && (
                  <div className="flex items-center justify-end">
                    <Link onClick={() => setState("ForgotPass")}>
                      Quên mật khẩu
                    </Link>
                  </div>
                )}
                <div className="col-span-2 row-start-5">
                  <Form.Item>
                    <Button
                      className="w-full !h-[40px] !rounded-xl !bg-primary !text-white !text-lg !my-4"
                      type="primary"
                      htmlType="submit"
                    >
                      <FaPaperPlane />
                      {state === "Login"
                        ? "Đăng nhập"
                        : state === "Register"
                        ? "Đăng ký"
                        : state === "VeryOtp"
                        ? "Xác thực OTP"
                        : state === "ForgotPass"
                        ? "Gửi Email xác thực"
                        : "Gửi mật khẩu mới"}
                    </Button>
                  </Form.Item>
                </div>
                <div className="col-span-2 row-start-6  flex items-center justify-center text-base">
                  {state === "Login" ? (
                    <>
                      Bạn chưa có tài khoản?
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => setState("Register")}
                      >
                        {" "}
                        Đăng ký
                      </span>
                    </>
                  ) : (
                    <>
                      Bạn đã có tài khoản?
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => setState("Login")}
                      >
                        {" "}
                        Đăng nhập
                      </span>
                    </>
                  )}
                </div>
                <div className="col-span-2 row-start-7  flex items-center justify-center my-4">
                  <div className="flex items-center justify-center w-full max-w-xs mx-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-3 text-gray-500 text-base font-sans select-none">
                      or
                    </span>
                    <hr className="flex-grow border-t border-gray-300" />
                  </div>
                </div>
                <div className="col-span-2 row-start-8">
                  <div className="text-center">
                    <p className="text-sm text-[#5B6B82] mb-4">
                      Tiếp tục với mạng xã hội
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <button className="flex items-center cursor-pointer hover:text-white hover:bg-[#3b5998] transition-all duration-300 ease-linear space-x-2 border border-[#3B5998] text-[#3B5998] rounded-full px-5 py-1.5 text-sm font-normal">
                        <FaFacebookF />
                        <span>Facebook</span>
                      </button>
                      <button className="flex items-center cursor-pointer hover:text-white hover:bg-[#D9482B] transition-all duration-300 ease-linear space-x-2 border border-[#D9482B] text-[#D9482B] rounded-full px-5 py-1.5 text-sm font-normal">
                        <FaGoogle />
                        <span>Google</span>
                      </button>
                      <button className="flex items-center cursor-pointer hover:text-white hover:bg-[#5EB7FF] transition-all duration-300 ease-linear space-x-2 border border-[#5EB7FF] text-[#5EB7FF] rounded-full px-5 py-1.5 text-sm font-normal">
                        <FaTwitter />
                        <span>Twitter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </>
  );
};

export default Login;
