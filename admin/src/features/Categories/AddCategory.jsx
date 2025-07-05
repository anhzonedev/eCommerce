import React, { useState, useContext } from "react";
import { Form, message, Upload, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import CustomForm from "../../components/common/Form/CustomForm";
import CustomButton from "../../components/common/Button/CustomButton";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const AddCategory = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được phép tải lên file ảnh!");
    }
    return isImage;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("isFeatured", values.isFeatured || false);
      formData.append("status", values.status || "active");

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      const response = await axios.post(
        `${backendUrl}/admin/category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success("Thêm danh mục cha thành công");
        navigate("/admin/categories");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: "name",
      label: "Tên danh mục",
      type: "input",
      rules: [
        { required: true, message: "Vui lòng nhập tên danh mục" },
        { max: 100, message: "Tên danh mục không quá 100 ký tự" },
      ],
      placeholder: "Nhập tên danh mục",
      colSpan: 2,
    },
    {
      name: "description",
      label: "Mô tả",
      type: "input",
      inputProps: { rows: 3 },
      placeholder: "Nhập mô tả danh mục",
      colSpan: 2,
    },
    {
      name: "image",
      label: "Hình ảnh",
      type: "upload",
      fileList: fileList,
      onChange: handleUploadChange,
      beforeUpload: beforeUpload,
      maxCount: 1,
      uploadButton: (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
      ),
      colSpan: 2,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      initialValue: "active",
      options: [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Không hoạt động" },
      ],
    },
    {
      name: "isFeatured",
      label: "Nổi bật",
      type: "select",
      initialValue: "false",
      options: [
        { value: "true", label: "Có" },
        { value: "false", label: "Không" },
      ],
    },
  ];

  return (
    <div>
      <BreadcrumbHeader
        title={"Thêm mới danh mục"}
        breadcrumbItems={[
          { title: "Danh mục", href: "/admin/categories" },
          { title: "Thêm mới danh mục" },
        ]}
      />
      <div className="bg-white p-6 mt-12 rounded-xl">
        <CustomForm
          form={form}
          fields={formFields}
          onFinish={onFinish}
          columns={2}
          submitText="Thêm danh mục"
          submitProps={{ loading: loading }}
        />
      </div>
    </div>
  );
};

export default AddCategory;
