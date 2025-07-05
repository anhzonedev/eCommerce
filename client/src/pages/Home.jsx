import React from "react";
import Banner from "../components/layout/Banner/Banner";
import InfoSection from "../components/layout/InfoSection";
import Categories from "../features/Categories/Categories";

const Home = () => {
  return (
    <div>
      <Banner />
      <InfoSection />
      <Categories />
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 my-6">
        <div className="flex-1 bg-[#cce7ff] rounded-lg p-6 relative overflow-hidden min-h-[220px]">
          <span className="text-[10px] font-semibold text-[#00b050]">
            Hot Collections
          </span>
          <h2 className="mt-1 font-semibold text-lg leading-tight max-w-[180px]">
            Best Travel Sale Collections
          </h2>
          <a
            className="mt-3 inline-block text-[10px] font-semibold text-black border-b border-black pb-[1px]"
            href="#"
          >
            DISCOVER NOW
          </a>
          <img
            alt="Brown travel bag, black t-shirt, and black shoes arranged on light blue background"
            className="absolute right-4 top-6 w-[160px] h-[140px] object-contain"
            height="140"
            src="https://storage.googleapis.com/a1aa/image/f4a79773-3b0c-445c-ab54-0eebcdcb8df5.jpg"
            width="160"
          />
          <svg
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full opacity-10"
            fill="none"
            viewbox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#0077cc"
              stroke-width="10"
            ></circle>
          </svg>
        </div>
        <div className="flex-1 bg-[#ffe9d3] rounded-lg p-6 relative overflow-hidden min-h-[220px]">
          <span className="text-[10px] font-semibold text-[#00b050]">
            Apple Collections
          </span>
          <h2 className="mt-1 font-semibold text-lg leading-tight max-w-[180px]">
            Apple Smart Watch Collections
          </h2>
          <a
            className="mt-3 inline-block text-[10px] font-semibold text-black border-b border-black pb-[1px]"
            href="#"
          >
            SHOP NOW
          </a>
          <img
            alt="Two Apple smart watches, one black and one pink, displayed on light peach background"
            className="absolute right-4 top-6 w-[160px] h-[140px] object-contain"
            height="140"
            src="https://storage.googleapis.com/a1aa/image/e7d60161-80a9-467d-fa11-ebda5acee3bc.jpg"
            width="160"
          />
          <svg
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full opacity-10"
            fill="none"
            viewbox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#ffb366"
              stroke-width="10"
            ></circle>
          </svg>
        </div>
        <div className="flex-1 bg-[#d7dfff] rounded-lg p-6 relative overflow-hidden min-h-[220px]">
          <span className="text-[10px] font-semibold text-[#00b050]">
            Shoe Collections
          </span>
          <h2 className="mt-1 font-semibold text-lg leading-tight max-w-[180px]">
            Summer Season Shoe Up To
            <span className="text-red-500">50%</span>
            Off
          </h2>
          <a
            className="mt-3 inline-block text-[10px] font-semibold text-black border-b border-black pb-[1px]"
            href="#"
          >
            DISCOVER NOW
          </a>
          <img
            alt="Pair of blue running shoes with white soles on light purple background"
            className="absolute right-4 top-6 w-[160px] h-[140px] object-contain"
            height="140"
            src="https://storage.googleapis.com/a1aa/image/e594163e-8efc-436e-356a-127dcb74b0d5.jpg"
            width="160"
          />
          <svg
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full opacity-10"
            fill="none"
            viewbox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#7a85ff"
              stroke-width="10"
            ></circle>
          </svg>
        </div>
      </div>

      <div class="rounded-lg overflow-hidden border border-gray-200 bg-white dark:border-gray-300  max-w-[230px]">
        <div class="h-52 w-full">
          <a href="#">
            <img
              class="mx-auto h-full w-full"
              src="https://cdn.tgdd.vn/Products/Images/42/336702/vivo-v50-lite-tim-thumbai-600x600.jpg"
              alt=""
            />
          </a>
        </div>
        <div class="p-6">
          <div class="mb-4 flex items-center justify-between gap-4">
            <span class="rounded px-2.5 py-0.5 text-xs font-medium bg-blue-300/50 text-blue-700/80">
              Up to 35% off
            </span>
          </div>

          <a
            href="#"
            className="block font-medium leading-tight text-gray-700 hover:underline hover:text-primary truncate max-w-[100ch]"
          >
            Apple iMac 27", 1TB HDD, Retina 5K Display, M3 Max
          </a>

          <div class="mt-2 flex items-center gap-2">
            <div class="flex items-center">
              <svg
                class="h-4 w-4 text-yellow-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
              </svg>
            </div>

            <p class="text-sm font-medium text-gray-900">5.0</p>
            <p class="text-sm font-medium text-gray-500">(455)</p>
            <p>* Đã bán 31.5K</p>
          </div>

          <ul class="mt-2 flex items-center gap-4">
            <li class="flex items-center gap-2">
              <svg
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                />
              </svg>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fast Delivery
              </p>
            </li>

            <li class="flex items-center gap-2">
              <svg
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Best Price
              </p>
            </li>
          </ul>

          <div class="mt-4 flex items-center justify-between gap-4">
            <p class="text-2xl font-extrabold leading-tight text-gray-900">
              $1,699
            </p>

            <button
              type="button"
              class="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium border-gray-300 border"
            >
              <svg
                class="-ms-2 me-2 h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                />
              </svg>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
