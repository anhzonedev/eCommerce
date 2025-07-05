import React, { useContext, useEffect, useState } from "react";
import { Tooltip, message, Form, Input, Select, Empty } from "antd";

import { MdDeleteForever } from "react-icons/md";
import { FaPen, FaRegPlusSquare } from "react-icons/fa";
import Loader from "../../components/common/Loader/Loader";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Modal from "../../components/common/Modal/CustomModal";
import AddressForm from "./components/AddressForm";
import AddressTable from "./components/AddressTable";
const AddressList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [state, setState] = useState("createAddr");
  const [editingAddressID, setEditingAddressID] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const { backendUrl, token, user } = useContext(AppContext);

  const showModal = (mode = "createAddr", addressData = null) => {
    setState(mode);
    if (mode === "editAddr" && addressData) {
      setEditingAddressID(addressData._id);
      form.setFieldsValue({
        fullName: addressData.fullName,
        phone: addressData.phone,
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
      const addressData = {
        fullName: values.fullName,
        phone: values.phone,
        province: selectedProvince?.label,
        district: selectedDistrict?.label,
        ward: values.ward,
        addressLine: values.addressLine,
        note: values.note,
      };

      if (state === "createAddr") {
        const response = await axios.post(
          `${backendUrl}/user/address`,
          addressData,
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
          addressData,
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

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách tỉnh/thành phố");
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts);
    } catch (error) {
      message.error("Không thể tải danh sách quận/huyện");
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);
    } catch (error) {
      message.error("Không thể tải danh sách phường/xã");
    }
  };

  const handleProvinceChange = (value, option) => {
    setSelectedProvince(option);
    form.setFieldsValue({ district: undefined, ward: undefined });
    setSelectedDistrict(null);
    setWards([]);
    fetchDistricts(value);
  };

  const handleDistrictChange = (value, option) => {
    setSelectedDistrict(option);
    form.setFieldsValue({ ward: undefined });
    fetchWards(value);
  };

  useEffect(() => {
    fetchAddress();
    fetchProvinces();
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
          <AddressTable
            data={address}
            loading={loading}
            onEdit={(item) => showModal("editAddr", item)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </main>
      <Modal
        title={
          state === "createAddr"
            ? "Thêm địa chỉ giao hàng mới"
            : "Chỉnh sửa địa chỉ"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={state === "createAddr" ? "Thêm" : "Cập nhật"}
      >
        <AddressForm
          form={form}
          provinces={provinces}
          districts={districts}
          wards={wards}
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          handleProvinceChange={handleProvinceChange}
          handleDistrictChange={handleDistrictChange}
          onFinish={onFinish}
        />
      </Modal>
    </>
  );
};

export default AddressList;
