import React, { useState, useEffect, useContext } from "react";
import { Form, message, Button, Input, Select, Steps, InputNumber } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import axios from "axios";
import CustomForm from "../../components/common/Form/CustomForm";
import { AppContext } from "../../context/AppContext";

const { Step } = Steps;

const Products = () => {
  const [form] = Form.useForm();
  const { token, backendUrl } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/admin/categories?parent=null`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data.categories);
      } catch (error) {
        message.error("Lỗi khi tải danh mục sản phẩm");
      }
    };
    fetchCategories();
  }, [token, backendUrl]);

  // Fetch subcategories
  const handleParentCategoryChange = async (parentId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/admin/categories/sub/${parentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubCategories(response.data.subCategories);
      form.setFieldsValue({ category: undefined });
    } catch (error) {
      message.error("Lỗi khi tải danh mục con");
    }
  };

  // Upload handler
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Attribute handlers
  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", values: [] }]);
  };

  // Variation handlers
  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        options: {},
        price: 0,
        stock: 0,
      },
    ]);
  };

  // Submit handler
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("parentCategory", values.parentCategory);
      formData.append("category", values.category);
      formData.append("attributes", JSON.stringify(attributes));
      formData.append("variations", JSON.stringify(variations));
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      await axios.post(`${backendUrl}/admin/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Thêm sản phẩm thành công");
      form.resetFields();
      setFileList([]);
      setAttributes([]);
      setVariations([]);
      setCurrentStep(0);
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Step fields
  const stepFields = [
    // Step 1: Basic Info
    [
      {
        name: "name",
        label: "Tên sản phẩm",
        type: "input",
        rules: [{ required: true, message: "Vui lòng nhập tên sản phẩm" }],
        colSpan: 2,
      },
      {
        name: "description",
        label: "Mô tả sản phẩm",
        type: "input",
        textarea: true,
        colSpan: 2,
      },
      {
        name: "parentCategory",
        label: "Danh mục cha",
        type: "select",
        rules: [{ required: true, message: "Vui lòng chọn danh mục cha" }],
        options: categories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        })),
        onChange: handleParentCategoryChange,
      },
      {
        name: "category",
        label: "Danh mục con",
        type: "select",
        rules: [{ required: true, message: "Vui lòng chọn danh mục con" }],
        options: subCategories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        })),
      },
      {
        name: "images",
        label: "Hình ảnh sản phẩm",
        type: "upload",
        fileList: fileList,
        onChange: handleUploadChange,
        beforeUpload: () => false,
        maxCount: 10,
        multiple: true,
        uploadButton: (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        ),
        colSpan: 2,
      },
    ],
    // Step 2: Attributes
    [
      {
        name: "attributes",
        label: "Thuộc tính",
        type: "custom",
        render: (
          <div>
            {attributes.map((attr, index) => (
              <div
                key={index}
                className="mb-4 p-2 border rounded flex flex-col gap-2"
              >
                <Form.Item
                  label="Tên thuộc tính"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên thuộc tính" },
                  ]}
                >
                  <Input
                    value={attr.name}
                    onChange={(e) => {
                      const newAttributes = [...attributes];
                      newAttributes[index].name = e.target.value;
                      setAttributes(newAttributes);
                    }}
                    placeholder="Ví dụ: Màu sắc, Kích cỡ"
                  />
                </Form.Item>
                <Form.Item
                  label="Giá trị thuộc tính (cách nhau bằng dấu phẩy)"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá trị thuộc tính",
                    },
                  ]}
                >
                  <Input
                    value={attr.values.join(",")}
                    onChange={(e) => {
                      const newAttributes = [...attributes];
                      newAttributes[index].values = e.target.value
                        .split(",")
                        .map((item) => item.trim());
                      setAttributes(newAttributes);
                    }}
                    placeholder="Ví dụ: Đỏ,Xanh,Đen"
                  />
                </Form.Item>
                <Button
                  danger
                  onClick={() => {
                    const newAttributes = [...attributes];
                    newAttributes.splice(index, 1);
                    setAttributes(newAttributes);
                  }}
                >
                  Xóa thuộc tính
                </Button>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={handleAddAttribute}
              icon={<PlusOutlined />}
              className="w-full"
            >
              Thêm thuộc tính
            </Button>
          </div>
        ),
        colSpan: 2,
      },
    ],
    // Step 3: Variations
    [
      {
        name: "variations",
        label: "Biến thể sản phẩm",
        type: "custom",
        render: (
          <div>
            {variations.map((variant, index) => (
              <div
                key={index}
                className="mb-4 p-2 border rounded flex flex-col gap-2"
              >
                <h4>Biến thể #{index + 1}</h4>
                {attributes.length > 0 ? (
                  attributes.map((attr) => (
                    <Form.Item
                      key={attr.name}
                      label={attr.name}
                      rules={[
                        {
                          required: true,
                          message: `Vui lòng chọn ${attr.name}`,
                        },
                      ]}
                    >
                      <Select
                        value={variant.options[attr.name]}
                        onChange={(value) => {
                          const newVariations = [...variations];
                          newVariations[index].options[attr.name] = value;
                          setVariations(newVariations);
                        }}
                        placeholder={`Chọn ${attr.name}`}
                      >
                        {attr.values.map((value) => (
                          <Select.Option key={value} value={value}>
                            {value}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ))
                ) : (
                  <p className="text-red-500">
                    Vui lòng thêm thuộc tính trước khi tạo biến thể
                  </p>
                )}
                <Form.Item
                  label="Giá"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    value={variant.price}
                    onChange={(value) => {
                      const newVariations = [...variations];
                      newVariations[index].price = value;
                      setVariations(newVariations);
                    }}
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                          " ₫"
                        : ""
                    }
                    parser={(value) =>
                      value ? value.replace(/[₫,\s]/g, "") : ""
                    }
                    placeholder="Nhập giá (VND)"
                  />
                </Form.Item>
                <Form.Item
                  label="Số lượng tồn kho"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}
                >
                  <Input
                    value={variant.stock.toLocaleString()}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^0-9]/g, "");
                      const numericValue =
                        rawValue === "" ? 0 : Number(rawValue);

                      const newVariations = [...variations];
                      newVariations[index].stock = numericValue;
                      setVariations(newVariations);
                    }}
                    onBlur={(e) => {
                      const newVariations = [...variations];
                      newVariations[index].stock = Number(
                        e.target.value.replace(/[^0-9]/g, "")
                      );
                      setVariations(newVariations);
                    }}
                  />
                </Form.Item>
                <Button
                  danger
                  onClick={() => {
                    const newVariations = [...variations];
                    newVariations.splice(index, 1);
                    setVariations(newVariations);
                  }}
                >
                  Xóa biến thể
                </Button>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={handleAddVariation}
              icon={<PlusOutlined />}
              className="w-full"
              disabled={attributes.length === 0}
            >
              Thêm biến thể
            </Button>
          </div>
        ),
        colSpan: 2,
      },
    ],
  ];

  // Step navigation
  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  // Validate and go to next step
  const handleNext = async () => {
    try {
      await form.validateFields(
        stepFields[currentStep].map((field) => field.name)
      );
      next();
    } catch (err) {
      // Validation error, do not proceed
    }
  };

  return (
    <div>
      <BreadcrumbHeader
        title={"Thêm sản phẩm mới"}
        breadcrumbItems={[
          { title: "Sản phẩm", link: "/products" },
          { title: "Thêm mới" },
        ]}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <Steps current={currentStep} className="!mb-6">
          <Step title="Thông tin cơ bản" />
          <Step title="Thuộc tính" />
          <Step title="Biến thể" />
        </Steps>
        <CustomForm
          form={form}
          fields={stepFields[currentStep]}
          onFinish={handleSubmit}
          columns={2}
          submitText="Thêm sản phẩm"
          submitProps={{
            loading: loading,
            icon: <UploadOutlined />,
            size: "large",
            style: { display: currentStep === 2 ? "inline-block" : "none" },
          }}
        />
        <div className="flex justify-between mt-4">
          {currentStep > 0 && (
            <Button onClick={prev} style={{ marginRight: 8 }}>
              Quay lại
            </Button>
          )}
          {currentStep < stepFields.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Tiếp theo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
