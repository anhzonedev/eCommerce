import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoSync, IoWalletOutline } from "react-icons/io5";
import { FaHeadset } from "react-icons/fa6";
const InfoSection = () => {
  return (
    <div className="mt-10">
      <div className="max-w-7xl mx-auto bg-[#f5fbff] rounded-xl py-8 px-6 flex flex-wrap justify-center gap-x-20 gap-y-6">
        <div className="flex items-center space-x-4 min-w-[180px]">
          <div className="bg-[#1db45a] rounded-full w-14 h-14 flex items-center justify-center text-white text-4xl">
            <CiDeliveryTruck />
          </div>
          <div>
            <p className="font-semibold text-black leading-5">
              Giao hàng miễn phí
            </p>
            <p className="text-gray-400 text-sm leading-4">
              Đơn hàng trên $120
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 min-w-[180px]">
          <div className="bg-[#1db45a] rounded-full w-14 h-14 flex items-center justify-center text-white text-4xl">
            <IoSync />
          </div>
          <div>
            <p className="font-semibold text-black leading-5">Nhận hoàn tiền</p>
            <p className="text-gray-400 text-sm leading-4">
              Trả hàng trong vòng 30 ngày
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 min-w-[180px]">
          <div className="bg-[#1db45a] rounded-full w-14 h-14 flex items-center justify-center text-white text-4xl">
            <IoWalletOutline />
          </div>
          <div>
            <p className="font-semibold text-black leading-5">
              Thanh toán an toàn
            </p>
            <p className="text-gray-400 text-sm leading-4">
              Thanh toán an toàn 100%
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 min-w-[180px]">
          <div className="bg-[#1db45a] rounded-full w-14 h-14 flex items-center justify-center text-white text-4xl">
            <FaHeadset />
          </div>
          <div>
            <p className="font-semibold text-black leading-5">Hỗ trợ 24/7</p>
            <p className="text-gray-400 text-sm leading-4">
              Hãy gọi cho chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
