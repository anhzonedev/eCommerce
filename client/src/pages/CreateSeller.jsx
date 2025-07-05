// CreateSeller.jsx
import React, { useContext, useState } from "react";
import { Divider, Form, message } from "antd";
import CustomButton from "../components/common/Button/CustomButton";
import { FaArrowRight } from "react-icons/fa";
import CustomForm from "../components/common/Form/CustomForm";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Loader from "../components/common/Loader/Loader";

const CreateSeller = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { backendUrl, setUser } = useContext(AppContext);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/seller/register-seller`,
        {
          username: values.username,
          email: values.email,
          phone: values.phone,
          shopName: values.shopName,
          country: values.country,
          password: values.password,
          addressSeller: values.addressSeller,
          addressShop: values.addressShop,
        }
      );
      if (response.data.success) {
        localStorage.setItem("account", JSON.stringify(response.data.account));
        setUser(response.data.account);
        setEmail(values.email);
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Họ tên",
      placeholder: "VD: Nguyễn Văn A",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập tên của bạn!" }],
      colSpan: 1,
    },
    {
      name: "email",
      label: "Email",
      type: "input",
      placeholder: "VD: abc123@gmail.com",
      rules: [{ required: true, message: "Vui lòng nhập email của bạn!" }],
      colSpan: 1,
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "VD: 0123456789",
      rules: [
        { required: true, message: "Vui lòng nhập số điện thoại của bạn!" },
      ],
      colSpan: 1,
    },
    {
      name: "shopName",
      label: "Tên cửa hàng",
      type: "input",
      placeholder: "VD: Cửa hàng ABC",
      rules: [
        { required: true, message: "Vui lòng nhập tên cửa hàng của bạn!" },
      ],
      colSpan: 1,
    },
    {
      name: "country",
      label: "Quốc gia",
      type: "input",
      placeholder: "VD: Việt Nam",
      rules: [{ required: true, message: "Vui lòng nhập quốc gia của bạn!" }],
      colSpan: 1,
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "input",
      placeholder: "VD: ************",
      inputProps: { type: "password" },
      rules: [{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }],
      colSpan: 1,
    },
    {
      name: "addressSeller",
      label: "Địa chỉ nhà riêng",
      type: "input",
      placeholder: "VD: Địa chỉ nhà riêng",
      rules: [
        { required: true, message: "Vui lòng nhập địa chỉ nhà riêng của bạn!" },
      ],
      colSpan: 2,
    },
    {
      name: "addressShop",
      label: "Địa chỉ cửa hàng",
      type: "input",
      placeholder: "VD: Địa chỉ cửa hàng",
      rules: [
        { required: true, message: "Vui lòng nhập địa chỉ cửa hàng của bạn!" },
      ],
      colSpan: 2,
    },
  ];

  return (
    <div className="bg-white mx-auto p-4 w-full my-10 px-4">
      {loading && <Loader />}
      <div className="grid grid-cols-4 gap-4 w-[1200px] mx-auto">
        <div className="col-span-3 row-span-3 border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-lg font-semibold">Đăng ký người bán</h1>
            <p className="text-sm text-gray-500">
              Bán hàng dễ dàng – Gia tăng lợi nhuận – Đăng ký ngay hôm nay!
            </p>
            <Divider />

            <CustomForm
              form={form}
              fields={fields}
              onFinish={onFinish}
              layout="vertical"
            />

            <CustomButton
              item={"Đăng ký ngay"}
              htmlType="submit"
              className="!w-[200px] mt-4"
              icon={<FaArrowRight />}
              onClick={() => form.submit()}
            />
          </div>
        </div>
        <div className="col-start-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-4">
          <div className="w-[70px] h-[70px]">
            <img src={assets.saleonline} alt="" className="w-full h-full" />
          </div>
          <h1 className="font-semibold">Bán sản phẩm của bạn trực tuyến</h1>
        </div>
        <div className="col-start-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center row-start-2 gap-4">
          <div className="w-[70px] h-[70px]">
            <img src={assets.timelypayment} alt="" className="w-full h-full" />
          </div>
          <h1 className="font-semibold">Nhận thanh toán đúng hạn</h1>
        </div>
        <div className="col-start-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center row-start-3 gap-4">
          <div className="w-[70px] h-[70px]">
            <img src={assets.support} alt="" className="w-full h-full" />
          </div>
          <h1 className="font-semibold">Công cụ hỗ trợ & tiếp thị</h1>
        </div>
      </div>
    </div>
  );
};

export default CreateSeller;
