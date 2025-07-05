import React from "react";
import Form from "../../../components/common/Form/CustomForm";
import { Select } from "antd";
const AddressForm = ({
  form,
  provinces,
  districts,
  wards,
  selectedProvince,
  selectedDistrict,
  handleProvinceChange,
  handleDistrictChange,
  onFinish,
}) => {
  const fields = [
    {
      name: "fullName",
      label: "Họ tên",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập tên!" }],
      colSpan: 1,
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập số điện thoại!" }],
      colSpan: 1,
    },
    {
      name: "province",
      label: "Tỉnh/Thành phố",
      type: "select",
      onChange: handleProvinceChange,
      placeholder: "Chọn tỉnh/thành phố",
      options: provinces.map((p) => ({ value: p.code, label: p.name })),
      rules: [{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }],
      colSpan: 1,
    },
    {
      name: "district",
      label: "Quận/Huyện",
      type: "select",
      onChange: handleDistrictChange,
      disabled: !selectedProvince,
      placeholder: "Chọn quận/huyện",
      options: districts.map((d) => ({ value: d.code, label: d.name })),
      rules: [{ required: true, message: "Vui lòng chọn quận/huyện!" }],
      colSpan: 1,
    },
    {
      name: "ward",
      label: "Phường/Xã",
      type: "select",
      disabled: !selectedDistrict,
      placeholder: "Chọn phường/xã",
      children: wards.map((w) => (
        <Select.Option key={w.code} value={w.name}>
          {w.name}
        </Select.Option>
      )),
      rules: [{ required: true, message: "Vui lòng chọn xã/phường!" }],
      colSpan: 1,
    },
    {
      name: "addressLine",
      label: "Địa chỉ chi tiết",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập địa chỉ chi tiết!" }],
      colSpan: 1,
    },
    {
      name: "note",
      label: "Mô tả",
      type: "input",
      colSpan: 2,
    },
  ];
  return (
    <div>
      <Form form={form} fields={fields} columns={2} onFinish={onFinish} />
    </div>
  );
};

export default AddressForm;
