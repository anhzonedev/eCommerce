import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { message } from "antd";
import axios from "axios"; // Don't forget to import axios

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import { AppContext } from "../../../context/AppContext";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const { backendUrl } = useContext(AppContext);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/banners`);
      if (response.data.success) {
        setBanners(response.data.banners);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi tải danh sách banner"
      );
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4 w-[1500px] h-[500px] mx-auto">
      <div className="col-span-4 row-span-6 rounded-2xl overflow-hidden">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          spaceBetween={30}
          centeredSlides={true}
          modules={[Pagination, Autoplay]}
          className="mySwiper w-full h-full"
        >
          {banners.length > 0 ? (
            banners.map((banner) => (
              <SwiperSlide
                key={banner._id}
                className="w-full h-full relative group"
              >
                <div className="relative w-full h-full">
                  <img
                    className="w-full h-full"
                    src={banner.image}
                    alt={banner.title || "Banner"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-1/4 left-10 transform translate-y-1/4 text-white max-w-lg space-y-4">
                  {banner.subTitle && (
                    <span className="text-lg font-medium text-primary-400 tracking-wider">
                      {banner.subTitle}
                    </span>
                  )}
                  {banner.title && (
                    <h1 className="text-4xl font-bold leading-tight">
                      {banner.title}
                    </h1>
                  )}
                  {banner.description && (
                    <p className="text-lg opacity-90 line-clamp-2">
                      {banner.description}
                    </p>
                  )}
                </div>
              </SwiperSlide>
            ))
          ) : (
            <>
              <SwiperSlide className="w-full h-full">
                <img
                  className="w-full h-full"
                  src="https://static.vecteezy.com/system/resources/previews/002/006/774/non_2x/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-backgroud-for-banner-market-ecommerce-free-vector.jpg"
                  alt="Default banner"
                />
              </SwiperSlide>
              <SwiperSlide className="w-full h-full">
                <img
                  className="w-full h-full"
                  src="https://static.vecteezy.com/system/resources/previews/002/006/774/non_2x/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-backgroud-for-banner-market-ecommerce-free-vector.jpg"
                  alt="Default banner"
                />
              </SwiperSlide>
            </>
          )}
        </Swiper>
      </div>
      <div className="col-span-2 row-span-3 col-start-5 bg-red-50 rounded-2xl overflow-hidden">
        <div className="flex bg-[#d3e9fc] h-full p-6 relative">
          <div className="flex flex-col justify-center flex-1">
            <span className="text-[#00c78a] text-sm font-semibold mb-1">
              Hot Collections
            </span>
            <h2 className="text-black text-xl font-semibold leading-tight mb-4">
              Best Travel Sale Collections
            </h2>
            <a
              className="text-black text-sm font-semibold border-b border-black w-max"
              href="#"
            >
              DISCOVER NOW
            </a>
          </div>
          <img
            alt="Travel items including a black t-shirt, brown leather bag, black shoes, and sunglasses arranged on a light blue background"
            className="w-[150px] h-[150px] object-contain ml-4"
            height="150"
            src="https://storage.googleapis.com/a1aa/image/311d8ce6-846a-4acc-7d5c-27b52e8d4d2b.jpg"
            width="150"
          />
        </div>
      </div>
      <div className="col-span-2 row-span-3 col-start-5 row-start-4 bg-green-50 rounded-2xl overflow-hidden">
        <div className="flex bg-[#ffe8d0] h-full p-6 relative">
          <div className="flex flex-col justify-center flex-1">
            <span className="text-[#00c78a] text-sm font-semibold mb-1">
              Apple Collections
            </span>
            <h2 className="text-black text-xl font-semibold leading-tight mb-4">
              Apple Smart Watch Collections
            </h2>
            <a
              className="text-black text-sm font-semibold border-b border-black w-max"
              href="#"
            >
              SHOP NOW
            </a>
          </div>
          <img
            alt="Two Apple smart watches with white and pink straps displayed on a light peach background"
            className="w-[150px] h-[150px] object-contain ml-4"
            height="150"
            src="https://storage.googleapis.com/a1aa/image/5fe9ac12-a244-4a7a-a7f0-1755a48f4942.jpg"
            width="150"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
