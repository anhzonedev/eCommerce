import React, { useState, useEffect, useContext } from "react";
import { Form, message, Input, Select } from "antd";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import CustomForm from "../../components/common/Form/CustomForm";
import CustomButton from "../../components/common/Button/CustomButton";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const AddSubCategory = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [fetchingParents, setFetchingParents] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setFetchingParents(true);
        const response = await axios.get(`${backendUrl}/admin/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            parent: "null", // Only get parent categories
          },
        });

        if (response.data.success) {
          setParentCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching parent categories:", error);
        message.error("Không thể tải danh sách danh mục cha");
      } finally {
        setFetchingParents(false);
      }
    };

    fetchParentCategories();
  }, [backendUrl, token]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/admin/category/sub`,
        {
          name: values.name,
          description: values.description || "",
          status: values.status || "active",
          parentId: values.parentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success("Thêm danh mục con thành công");
        navigate("/admin/categories");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục con"
      );
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: "parentId",
      label: "Danh mục cha",
      type: "select",
      rules: [{ required: true, message: "Vui lòng chọn danh mục cha" }],
      options: parentCategories.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
      loading: fetchingParents,
      placeholder: "Chọn danh mục cha",
      colSpan: 2,
    },
    {
      name: "name",
      label: "Tên danh mục con",
      type: "input",
      rules: [
        { required: true, message: "Vui lòng nhập tên danh mục con" },
        { max: 100, message: "Tên danh mục không quá 100 ký tự" },
      ],
      placeholder: "Nhập tên danh mục con",
      colSpan: 2,
    },
    {
      name: "description",
      label: "Mô tả",
      type: "input",
      inputProps: { rows: 3 },
      placeholder: "Nhập mô tả danh mục con",
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
  ];

  return (
    <div>
      <BreadcrumbHeader
        title={"Thêm mới danh mục con"}
        breadcrumbItems={[
          { title: "Danh mục", href: "/admin/categories" },
          { title: "Thêm mới danh mục con" },
        ]}
      />
      <div className="bg-white p-6 mt-12 rounded-xl">
        <CustomForm
          form={form}
          fields={formFields}
          onFinish={onFinish}
          columns={2}
          submitText="Thêm danh mục con"
          submitProps={{ loading: loading }}
        />
      </div>
    </div>
  );
};

export default AddSubCategory;
