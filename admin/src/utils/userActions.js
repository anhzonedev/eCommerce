// src/utils/userActions.js
import axios from "axios";
import { message } from "antd";

export const toggleBlockUser = async (
  userId,
  isBlocked,
  backendUrl,
  token,
  callback
) => {
  try {
    const action = isBlocked ? "block" : "unblock";
    const response = await axios.post(
      `${backendUrl}/admin/users/${userId}/block`,
      { action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      message.success(response.data.message);
      callback?.();
    }
  } catch (error) {
    message.error(
      error.response?.data?.message ||
        "Có lỗi xảy ra khi khóa/mở khóa tài khoản."
    );
  }
};
 

export const deleteUser = async (userId, backendUrl, token, callback) => {
  try {
    const response = await axios.delete(`${backendUrl}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      message.success(response.data.message);
      callback?.();
    }
  } catch (error) {
    message.error(
      error.response?.data?.message || "Xóa tài khoản không thành công"
    );
  }
};
