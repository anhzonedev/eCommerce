import React, { useContext, useEffect, useState } from "react";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { message, Button, DatePicker, Row, Col, Form, Space } from "antd";
import { CiCirclePlus } from "react-icons/ci";
import CustomTable from "../../components/common/Table/CustomTable";
import ActionColumn from "../../components/common/ActionColumn/ActionColumn";
import dayjs from "dayjs";
import { FilterOutlined, RedoOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const Banners = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [banners, setBanners] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchBanners = async (
    page = 1,
    pageSize = pagination.pageSize,
    filterParams = {}
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/admin/banners`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: pageSize,
          ...filterParams,
        },
      });
      if (response.data.success) {
        setBanners(response.data.banners);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: response.data.totalBanners,
        }));
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi tải danh sách banner"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/admin/banners/${bannerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        message.success("Xóa banner thành công");
        fetchBanners(pagination.current);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa banner");
    }
  };

  const handleFilter = (values) => {
    const { dateRange } = values;
    const filterParams = {};

    if (dateRange && dateRange.length === 2) {
      filterParams.startDate = dayjs(dateRange[0]).startOf("day").toISOString();
      filterParams.endDate = dayjs(dateRange[1]).endOf("day").toISOString();
    }

    fetchBanners(1, pagination.pageSize, filterParams);
  };

  const resetFilters = () => {
    form.resetFields();
    fetchBanners(1);
  };

  useEffect(() => {
    fetchBanners(1);
  }, []);

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tiêu đề phụ",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Banner" style={{ width: 100, height: "auto" }} />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <ActionColumn
          record={record}
          toggleAction={""}
          viewLink={(rec) => `/admin/banners/${rec._id}`}
          deleteAction={() => handleDeleteBanner(record._id)}
          deleteTitle="Xóa banner"
          deleteDescription="Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác."
        />
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbHeader
        title={"Quản lý Banner"}
        breadcrumbItems={[{ title: "Banners" }]}
      />
      <div className="bg-white p-6 mt-12 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Button href="/admin/add-banner" type="primary">
            <CiCirclePlus className="text-2xl font-bold" />
            Thêm mới Banner
          </Button>
        </div>

        <Form form={form} onFinish={handleFilter} layout="vertical" className="">
        <h1 className="mb-2 text-base font-semibold text-gray-600">Khoảng thời gian</h1>
          <Row gutter={16} className="mb-6">
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="dateRange">
                <RangePicker
                  style={{ width: "100%" }}
                  ranges={{
                    "Hôm nay": [dayjs().startOf("day"), dayjs().endOf("day")],
                    "Tháng này": [
                      dayjs().startOf("month"),
                      dayjs().endOf("month"),
                    ],
                    "Tháng trước": [
                      dayjs().subtract(1, "month").startOf("month"),
                      dayjs().subtract(1, "month").endOf("month"),
                    ],
                  }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} className="flex items-end">
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FilterOutlined />}
                >
                  Lọc
                </Button>
                <Button onClick={resetFilters} icon={<RedoOutlined />}>
                  Đặt lại
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <CustomTable
          rowKey="_id"
          columns={columns}
          dataSource={banners}
          loading={loading}
          pagination={pagination}
          onChange={(pagination) =>
            fetchBanners(pagination.current, pagination.pageSize)
          }
        />
      </div>
    </div>
  );
};

export default Banners;
