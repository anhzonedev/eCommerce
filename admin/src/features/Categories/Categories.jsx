import React, { useState, useEffect, useContext } from "react";
import { Button, Input, Select, Space, Tag, Table, message } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import ActionColumn from "../../components/common/ActionColumn/ActionColumn";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../components/common/Table/CustomTable";

const { Option } = Select;

const Categories = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    isFeatured: "",
    parent: "null", // Mặc định chỉ hiển thị danh mục cha
  });
  const navigate = useNavigate();

  // ...existing code...

  const fetchCategories = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        ...filters,
      };

      const response = await axios.get(`${backendUrl}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        let categoriesData = response.data.categories;

        // Fetch subcategories for each parent category in parallel
        const categoriesWithSubs = await Promise.all(
          categoriesData.map(async (cat) => {
            if (cat.subCategoryCount > 0) {
              const subCategories = await fetchSubCategories(cat._id);
              return { ...cat, subCategories };
            }
            return { ...cat, subCategories: [] };
          })
        );

        setCategories(categoriesWithSubs);
        setPagination({
          current: response.data.currentPage,
          pageSize,
          total: response.data.totalCategories,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove fetchSubCategories from useEffect (not needed there)
  useEffect(() => {
    fetchCategories();
  }, [filters]);

  // Remove handleExpand logic for fetching subcategories, just handle expand keys
  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record._id]
      : expandedRowKeys.filter((key) => key !== record._id);
    setExpandedRowKeys(keys);
  };


  const fetchSubCategories = async (parentId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/admin/categories/sub/${parentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.subCategories;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);


  const handleTableChange = (pagination) => {
    fetchCategories(pagination.current, pagination.pageSize);
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
  };

  const handleStatusFilter = (value) => {
    setFilters({ ...filters, status: value });
  };

  const handleFeaturedFilter = (value) => {
    setFilters({ ...filters, isFeatured: value });
  };

  const handleParentFilter = (value) => {
    setFilters({ ...filters, parent: value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      isFeatured: "",
      parent: "null",
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${backendUrl}/admin/categories/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "Xóa danh mục thành công");
        const remainingItems = pagination.total - 1;
        const maxPage = Math.ceil(remainingItems / pagination.pageSize);

        const newPage =
          pagination.current > maxPage && maxPage > 0
            ? maxPage
            : pagination.current;

        fetchCategories(newPage, pagination.pageSize);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error(
        error.response?.data?.message ||
          "Xóa danh mục thất bại. Vui lòng thử lại!"
      );
      if (error.response?.data?.details) {
        message.error(error.response.data.details);
      }
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-xs">{record.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Category"
          className="w-[50px] h-auto rounded-full overflow-hidden"
        />
      ),
    },
    {
      title: "Số danh mục con",
      dataIndex: "subCategoryCount",
      key: "subCategoryCount",
      render: (count) => count || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Nổi bật",
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (isFeatured) => (
        <Tag color={isFeatured ? "blue" : "default"}>
          {isFeatured ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => (createdBy ? createdBy.username : "Hệ thống"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <ActionColumn
          record={record}
          viewLink={(rec) => `/admin/categories/${rec._id}`}
          editLink={(rec) => `/admin/categories/edit/${rec._id}`}
          deleteAction={handleDeleteCategory}
          deleteTitle={`Xóa danh mục ${record.name}`}
          deleteDescription={
            record.subCategoryCount > 0
              ? "Danh mục này có danh mục con. Bạn không thể xóa!"
              : "Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
          }
          disableDelete={record.subCategoryCount > 0}
        />
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbHeader
        title={"Quản lý Danh mục"}
        breadcrumbItems={[{ title: "Danh mục" }]}
      />
      <div className="bg-white p-6 mt-12 rounded-xl">
        <div className="flex justify-between mb-6">
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên hoặc mô tả"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Trạng thái"
              style={{ width: 150 }}
              onChange={handleStatusFilter}
              value={filters.status || undefined}
              allowClear
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
            <Select
              placeholder="Nổi bật"
              style={{ width: 150 }}
              onChange={handleFeaturedFilter}
              value={filters.isFeatured || undefined}
              allowClear
            >
              <Option value="true">Có</Option>
              <Option value="false">Không</Option>
            </Select>
            <Select
              placeholder="Loại danh mục"
              style={{ width: 200 }}
              onChange={handleParentFilter}
              value={filters.parent || undefined}
              allowClear
            >
              <Option value="null">Danh mục cha</Option>
              <Option value="all">Tất cả danh mục</Option>
            </Select>
            <Button onClick={resetFilters}>Đặt lại bộ lọc</Button>
          </Space>
          <Space>
            <div className="flex gap-2">
              <Button
                href="/admin/create-category"
                type="primary"
                icon={<PlusOutlined />}
              >
                Thêm danh mục
              </Button>
              <Button
                href="/admin/add-subcategory"
                type="primary"
                icon={<PlusOutlined />}
              >
                Thêm danh mục con
              </Button>
            </div>
          </Space>
        </div>
        <CustomTable
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          fetchUsers={fetchCategories}
          onChange={handleTableChange}
          expandable={
            filters.parent === "null" && {
              expandedRowKeys,
              onExpand: handleExpand,
              expandedRowRender: (record) => (
                <CustomTable
                  className="ml-18"
                  columns={columns.filter(
                    (col) =>
                      ![
                        "subCategoryCount",
                        "parent",
                        "image",
                        "createdAt",
                        "createdBy",
                      ].includes(col.key)
                  )}
                  dataSource={record.subCategories || []}
                  rowKey="_id"
                  pagination={false}
                />
              ),
              rowExpandable: (record) => record.subCategoryCount > 0,
            }
          }
        />
      </div>
    </div>
  );
};

export default Categories;
