import React, { useContext, useEffect, useState } from "react";
import BreadcrumbHeader from "../../components/common/BreadcrumbHeader";
import { toggleBlockUser, deleteUser } from "../../utils/userActions";
import {
  EditOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  message,
  Space,
  Tag,
  Tabs,
  Badge,
  Descriptions,
  Menu,
  Popconfirm,
  Dropdown,
  Empty,
} from "antd";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader/Loader";
const { TabPane } = Tabs;
const UserDetails = () => {
  const { userID } = useParams();
  const { token, backendUrl } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userID, token, backendUrl]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi lấy thông tin người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = () => {
    toggleBlockUser(user._id, !user.isBlocked, backendUrl, token, () => {
      fetchUserDetails();
    });
  };


  const handleDelete = () => {
    deleteUser(user._id, backendUrl, token, () => {
      message.success("Tài khoản đã bị xóa");
    });
  };

  const menu = user && (
    <Menu>
      <Menu.Item key="block" onClick={handleToggleBlock}>
        {user.isBlocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          title="Xác nhận xóa"
          description="Bạn có chắc muốn xóa tài khoản này?"
          onConfirm={handleDelete}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <span className="text-red-500">Xóa tài khoản</span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const actions = [
    user && (
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        key="ellipsis"
        className="!max-w-[400px]"
      >
        <EllipsisOutlined style={{ fontSize: 18, cursor: "pointer" }} />
      </Dropdown>
    ),
  ];
  const getRoleColor = (role) => {
    switch (role) {
      case "user":
        return "green";
      case "seller":
        return "blue";
      default:
        return "green";
    }
  };
  return (
    <div>
      <BreadcrumbHeader
        title={"Chi tiết tài khoản"}
        breadcrumbItems={[
          { title: "Users", href: "/admin/users" },
          { title: "UserDetails" },
        ]}
      />
      {loading && <Loader />}
      {user && (
        <Card className="!mt-10" actions={actions} style={{ minWidth: 300 }}>
          <Card.Meta
            className=""
            avatar={
              <Avatar
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.username}`
                }
                size={84}
                alt="User Avatar"
              />
            }
            title={user.username}
            description={
              <>
                <Space>
                  <Tag color={getRoleColor(user.role)}>
                    {user.role === "seller" ? "Người bán" : "Người dùng"}
                  </Tag>
                  <Tag color={user.isBlocked ? "error" : "success"}>
                    {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                  </Tag>
                </Space>
              </>
            }
          />
          <Tabs defaultActiveKey="1" className="!mt-10">
            <TabPane tab="Thông tin cơ bản" key="1">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Email" span={3}>
                  <Space>
                    <MailOutlined />
                    {user.email}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={3}>
                  <Space>
                    <PhoneOutlined />
                    {user.phone}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={3}>
                  <Badge
                    status={user.isBlocked ? "error" : "processing"}
                    text={user.isBlocked ? "Đã khóa" : "Hoạt động"}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo" span={3}>
                  {new Date(user.createdAt).toLocaleString()}
                </Descriptions.Item>
                {user.role === "seller" && (
                  <>
                    <Descriptions.Item label="Tên cửa hàng">
                      <Space>
                        <ShopOutlined />
                        {user.shopName || "Chưa cập nhật"}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ cửa hàng">
                      <Space>
                        <EnvironmentOutlined />
                        {user.addressShop || "Chưa cập nhật"}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ nhà riêng">
                      <Space>
                        <EnvironmentOutlined />
                        {user.addressSeller || "Chưa cập nhật"}
                      </Space>
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </TabPane>
            {!user.address || user.address.length === 0 ? (
              <TabPane tab="Địa chỉ nhận hàng" key="3">
                <Empty description="Chưa có địa chỉ" />
              </TabPane>
            ) : (
              <TabPane tab="Địa chỉ nhận hàng" key="3">
                {user.address.map((addr, index) => (
                  <Card
                    key={index}
                    title={`Địa chỉ ${index + 1}`}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Họ và tên">
                        {addr.fullName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại">
                        {addr.phone}
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">
                        {`${addr.addressLine}, ${addr.ward}, ${addr.district}, ${addr.province}`}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ghi chú">
                        {addr.note || "Không có"}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ))}
              </TabPane>
            )}
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default UserDetails;
