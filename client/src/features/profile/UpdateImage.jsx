import React, { useContext, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { message } from "antd";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/common/Loader/Loader";

const UpdateImage = () => {
  const { user, setUser, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        message.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        message.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendUrl}/auth/update-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const updatedUser = {
          ...user,
          avatar: response.data.account.avatar,
        };
        setUser(updatedUser);
        const existingAccount = JSON.parse(
          localStorage.getItem("account") || "{}"
        );
        const updatedAccount = {
          ...existingAccount,
          avatar: response.data.account.avatar,
        };
        localStorage.setItem("account", JSON.stringify(updatedAccount));

        message.success("Cập nhật ảnh đại diện thành công");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật ảnh đại diện"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="relative w-28 h-28 rounded-full p-1 border-2 border-[#11b76b]">
          <img
            src={
              user?.avatar?.trim()
                ? user.avatar
                : `https://ui-avatars.com/api/?name=${user.username}`
            }
            alt="avatar"
            className="rounded-full w-full h-full object-cover"
          />

          <label
            htmlFor="avatar-input"
            className={`absolute bottom-0 right-0 p-2 cursor-pointer z-30 bg-primary rounded-full text-white flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaCamera />
            <input
              type="file"
              id="avatar-input"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
              disabled={loading}
            />
          </label>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold text-base text-primary">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <div className="border-b block w-full border-gray-300"></div>
      </div>
    </div>
  );
};

export default UpdateImage;
