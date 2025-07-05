import React from 'react'
import { Button } from "antd";
const CustomButton = ({
  item,
  onClick,
  htmlType = "button",
  icon,
  className = "",
  ...props
}) => {
  return (
    <Button
      className={`w-full !h-[40px] !rounded-xl !bg-primary !text-white !text-lg !my-4 flex items-center justify-center ${className}`}
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
      {...props}
    >
      {item}
      {icon}
    </Button>
  );
};

export default CustomButton