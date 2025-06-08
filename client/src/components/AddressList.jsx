import React, { useContext, useEffect, useState } from "react";
import { Tooltip, Modal, message, Form, Input, Empty } from "antd";

import { MdDeleteForever } from "react-icons/md";
import { FaPen, FaRegPlusSquare } from "react-icons/fa";
import Loader from "./Loader";
import axios from "axios";
import { AppContext } from "../context/AppContext";
const AddressList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [state, setState] = useState("createAddr");
  const [editingAddressID, setEditingAddressID] = useState(null);
  const { backendUrl, token, user } = useContext(AppContext);

  const showModal = (mode = "createAddr", addressData = null) => {
    setState(mode);
    if (mode === "editAddr" && addressData) {
      setEditingAddressID(addressData._id);
      form.setFieldsValue({
        fullName: addressData.fullName,
        phone: addressData.phone,
        ward: addressData.ward,
        district: addressData.district,
        city: addressData.city,
        addressLine: addressData.addressLine,
        note: addressData.note,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
  };
  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (state === "createAddr") {
        const response = await axios.post(
          `${backendUrl}/user/address`,
          {
            fullName: values.fullName,
            phone: values.phone,
            ward: values.ward,
            district: values.district,
            city: values.city,
            addressLine: values.addressLine,
            note: values.note,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          message.success(response.data.message);
          setIsModalOpen(false);
          form.resetFields();
          fetchAddress();
        } else {
          message.error(response.data.message);
        }
      } else if (state === "editAddr") {
        const response = await axios.put(
          `${backendUrl}/user/address/${editingAddressID}`,
          {
            fullName: values.fullName,
            phone: values.phone,
            ward: values.ward,
            district: values.district,
            city: values.city,
            addressLine: values.addressLine,
            note: values.note,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          message.success(response.data.message);
          setIsModalOpen(false);
          form.resetFields();
          fetchAddress();
        } else {
          message.warning(response.data.message);
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${backendUrl}/user/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        message.success(response.data.message);
        setAddress(response.data.address);
        fetchAddress();
      } else {
        message.warning(response.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/user/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAddress(response.data.address);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);
  return (
    <>
      {loading && <Loader />}
      <main className="bg-white rounded-xl flex-1 p-6 select-none shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-semibold text-[#1a202c]">
            Địa chỉ giao hàng
          </h2>
          <button
            onClick={() => showModal("createAddr")}
            className="bg-[#00a65a] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-[14px] font-medium hover:bg-[#008f4b] transition-colors cursor-pointer"
            type="button"
          >
            <FaRegPlusSquare />
            Thêm địa chỉ mới
          </button>
        </div>
        <hr className="border-t border-gray-200 mb-6" />
        {address.length === 0 ? (
          <Empty description="Bạn chưa có địa chỉ nào" />
        ) : (
          <table className="w-full text-left text-[14px] text-gray-700">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-3 font-semibold text-gray-600 pl-4">
                  Họ tên
                </th>
                <th className="py-3 font-semibold text-gray-600">Địa chỉ</th>
                <th className="py-3 font-semibold text-gray-600">
                  Số điện thoại
                </th>
                <th className="py-3 font-semibold text-gray-600">Mô tả</th>
                <th className="py-3 font-semibold text-gray-600 pr-4 text-right">
                  Hoạt động
                </th>
              </tr>
            </thead>
            <tbody>
              {address.map((item) => {
                return (
                  <tr className="bg-[#f7faff] rounded-lg mb-2" key={item._id}>
                    <td className="py-3 pl-4 text-[#aab6e6] font-semibold underline cursor-pointer">
                      {item.fullName}
                    </td>
                    <td className="py-3">{`${item.addressLine}, ${item.ward}, ${item.district}, ${item.city}`}</td>
                    <td className="py-3">{item.phone}</td>
                    <td className="py-3">{item.note || "-"}</td>
                    <td className="py-3 pr-4 text-right flex gap-2 justify-end">
                      <Tooltip title={"Chỉnh sửa"}>
                        <button
                          onClick={() => showModal("editAddr", item)}
                          aria-label="Edit address"
                          className="cursor-pointer border border-gray-300 rounded-md w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#00a65a] hover:border-[#00a65a] transition-colors"
                        >
                          <FaPen />
                        </button>
                      </Tooltip>

                      <Tooltip title={"Xóa"}>
                        <button
                          onClick={() => handleDelete(item._id)}
                          aria-label="Delete address"
                          className="cursor-pointer border border-[#ff4d4f] rounded-md w-8 h-8 flex items-center justify-center text-[#ff4d4f] hover:bg-[#ff4d4f] hover:text-white transition-colors"
                        >
                          <MdDeleteForever />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
      <Modal
        style={{ minWidth: 800, padding: 10, maxWidth: 1000 }}
        title={
          state === "createAddr"
            ? "Thêm địa chỉ giao hàng mới"
            : "Chỉnh sửa địa chỉ"
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        okText={state === "createAddr" ? "Thêm" : "Cập nhật"}
        onCancel={handleCancel}
      >
        <div className="py-4">
          <Form
            className="w-full"
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item
                  label="Họ tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Xã/Phường"
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng nhập xã phường!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Quận/Huyện/Thành phố"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng nhập quận/huyện!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Tỉnh"
                  name="city"
                  rules={[
                    { required: true, message: "Vui lòng nhập thành phố!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-span-2 row-start-4">
                <Form.Item
                  label="Địa chỉ chi tiết"
                  name="addressLine"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ chi tiết!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-span-2 row-start-5">
                <Form.Item label="Mô tả" name="note">
                  <Input />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddressList;
