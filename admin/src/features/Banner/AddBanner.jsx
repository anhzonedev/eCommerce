import React, { useState } from "react";
import { Form, Input, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import CustomForm from "../../components/common/Form/CustomForm";

const AddBanner = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(AppContext);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên file ảnh!");
    }
    return isImage ? false : Upload.LIST_IGNORE;
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("subTitle", values.subTitle);
    formData.append("description", values.description);
    fileList.forEach((file) => {
      formData.append("image", file.originFileObj);
    });

    try {
      const response = await axios.post(
        `${backendUrl}/admin/banner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success(response.data.message);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const fields = [
    {
      name: "title",
      label: "Tiêu đề",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập tiêu đề!" }],
      inputProps: {
        placeholder: "Nhập tiêu đề banner",
      },
    },
    {
      name: "subTitle",
      label: "Tiêu đề phụ",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập tiêu đề phụ!" }],
      inputProps: {
        placeholder: "Nhập tiêu đề phụ",
      },
    },
    {
      name: "description",
      label: "Mô tả",
      type: "input",
      rules: [{ required: true, message: "Vui lòng nhập mô tả!" }],
      inputProps: {
        placeholder: "Nhập mô tả banner",
        textarea: true,
      },
    },
    {
      name: "image",
      label: "Hình ảnh",
      type: "upload",
      rules: [{ required: true, message: "Vui lòng tải lên hình ảnh!" }],
      fileList: fileList,
      onChange: handleUploadChange,
      beforeUpload: beforeUpload,
      uploadButton: uploadButton,
      maxCount: 1,
      accept: "image/*",
    },
  ];

  return (
    <div>
      <BreadcrumbHeader
        title={"Thêm mới Banner"}
        breadcrumbItems={[
          { title: "Banners", href: "/admin/banners" },
          { title: "Add Banners" },
        ]}
      />
      <div className="bg-white p-6 mt-12 rounded-xl">
        <CustomForm
          form={form}
          fields={fields}
          onFinish={onFinish}
          submitText="Thêm Banner"
          submitProps={{ loading }}
        />
      </div>
    </div>
  );
};

export default AddBanner;
