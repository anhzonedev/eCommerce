import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#0B1E2D] text-white mt-36">
      <footer className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
          <div className="space-y-5 max-w-[280px]">
            <div className="flex items-center space-x-2">
              <img
                alt="Green shopping bag icon with white handle"
                className="w-10 h-10 object-contain"
                height="40"
                src="https://storage.googleapis.com/a1aa/image/d02d72f2-3e9e-47e4-3605-0a9392a3dc08.jpg"
                width="40"
              />
              <div>
                <h1 className="text-white font-extrabold text-xl tracking-wide">
                  GO
                  <span className="text-[#2ECC71]">E</span>
                  MART
                </h1>
                <p className="text-[#2ECC71] text-xs font-semibold tracking-widest leading-[1]">
                  HAPPY SHOPPING
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              We are many variations of the passages available but the majoro
              have suffered alteration in some form by injected.
            </p>
            <div className="flex items-center space-x-3 text-[10px] md:text-xs">
              <i className="fas fa-headset text-[#F7941D] text-3xl"></i>
              <div>
                <p>
                  24/7
                  <span className="font-semibold">Need Any Help?</span>
                </p>
                <p className="text-[#F7941D] font-extrabold text-sm md:text-base">
                  (+2) 222 666 7777
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Get Our Mobile App</h3>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 bg-[#1E2E3E] rounded-md px-3 py-2 text-xs md:text-sm">
                  <img
                    alt="Play store triangle icon"
                    className="w-5 h-5 object-contain"
                    height="20"
                    src="https://storage.googleapis.com/a1aa/image/34b543fa-bf20-442c-8738-695267a5ecf7.jpg"
                    width="20"
                  />
                  <div className="text-left leading-[1]">
                    <p className="text-[8px] md:text-xs">Get It On</p>
                    <p className="font-extrabold text-[10px] md:text-sm">
                      Google Play
                    </p>
                  </div>
                </button>
                <button className="flex items-center space-x-2 bg-[#1E2E3E] rounded-md px-3 py-2 text-xs md:text-sm">
                  <img
                    alt="Apple store icon letter A"
                    className="w-5 h-5 object-contain"
                    height="20"
                    src="https://storage.googleapis.com/a1aa/image/7218283e-fd66-4551-4741-9c43247214da.jpg"
                    width="20"
                  />
                  <div className="text-left leading-[1]">
                    <p className="text-[8px] md:text-xs">Get It On</p>
                    <p className="font-extrabold text-[10px] md:text-sm">
                      App Store
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 relative inline-block pb-1">
              Quick Links
              <span className="absolute left-0 bottom-0 w-5 h-[2px] bg-[#2ECC71] rounded"></span>
              <span className="absolute left-6 bottom-0 w-5 h-[2px] bg-gray-600 rounded"></span>
            </h3>
            <ul className="space-y-2 text-sm font-normal">
              <li>About Us</li>
              <li>Become A Seller</li>
              <li>Contact Us</li>
              <li>Update News</li>
              <li>Testimonials</li>
              <li>Terms Of Service</li>
              <li>Privacy policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 relative inline-block pb-1">
              Browse Category
              <span className="absolute left-0 bottom-0 w-5 h-[2px] bg-[#2ECC71] rounded"></span>
              <span className="absolute left-6 bottom-0 w-5 h-[2px] bg-gray-600 rounded"></span>
            </h3>
            <ul className="space-y-2 text-sm font-normal">
              <li>Accessories</li>
              <li>Home &amp; Garden</li>
              <li>Electronics</li>
              <li>Health &amp; Beauty</li>
              <li>Groceries</li>
              <li>Baby Toys</li>
              <li>Music &amp; Video</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 relative inline-block pb-1">
              Support Center
              <span className="absolute left-0 bottom-0 w-5 h-[2px] bg-[#2ECC71] rounded"></span>
              <span className="absolute left-6 bottom-0 w-5 h-[2px] bg-gray-600 rounded"></span>
            </h3>
            <ul className="space-y-2 text-sm font-normal">
              <li>FAQ's</li>
              <li>How To Buy</li>
              <li>Support Center</li>
              <li>Track Your Order</li>
              <li>Returns Policy</li>
              <li>Our Affiliates</li>
              <li>Sitemap</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 relative inline-block pb-1">
              Get In Touch
              <span className="absolute left-0 bottom-0 w-5 h-[2px] bg-[#2ECC71] rounded"></span>
              <span className="absolute left-6 bottom-0 w-5 h-[2px] bg-gray-600 rounded"></span>
            </h3>
            <p className="text-sm mb-4 leading-relaxed max-w-[250px]">
              Feel Free To Get In Touch With Us Today. We Are Ready To Help You.
            </p>
            <ul className="space-y-4 text-sm font-normal">
              <li className="flex items-center space-x-3">
                <div className="bg-[#1E2E3E] p-2 rounded-full flex justify-center items-center">
                  <i className="fas fa-phone-alt text-[#9CA3AF] text-sm"></i>
                </div>
                <span>+2 123 654 7898</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-[#1E2E3E] p-2 rounded-full flex justify-center items-center">
                  <i className="fas fa-map-marker-alt text-[#9CA3AF] text-sm"></i>
                </div>
                <span>25/B Milford Road, New York</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-[#1E2E3E] p-2 rounded-full flex justify-center items-center">
                  <i className="fas fa-envelope text-[#9CA3AF] text-sm"></i>
                </div>
                <span>info@example.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-[#1E2E3E] p-2 rounded-full flex justify-center items-center">
                  <i className="fas fa-clock text-[#9CA3AF] text-sm"></i>
                </div>
                <span>Mon-Fri (9.00AM - 8.00PM)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 max-w-[1100px] mx-auto">
          <h3 className="text-sm font-semibold mb-3">Top Links</h3>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-600">
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Top Sellers
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              New Arrivals
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Accessories
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Electronics
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Groceries
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Beauty
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Health
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Baby Toys
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Music
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Furniture
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Gifts
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Sports
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Automotive
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Watch
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Sitemap
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Our Affiliates
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Returns Policy
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Video
            </button>
            <button className="border border-gray-700 rounded-full px-3 py-1">
              Home &amp; Garden
            </button>
          </div>
        </div>
        <div className="mt-14 max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-white">
          <div className="mb-6 md:mb-0 flex items-center space-x-2">
            <span className="font-semibold">We Accept:</span>
            <img
              alt="Visa card logo"
              className="h-5 object-contain"
              height="20"
              src="https://storage.googleapis.com/a1aa/image/93b2c2ed-9cb2-44f1-c9e8-e86234db6ce0.jpg"
              width="40"
            />
            <img
              alt="MasterCard logo"
              className="h-5 object-contain"
              height="20"
              src="https://storage.googleapis.com/a1aa/image/0e7afdeb-e166-4530-67dd-83d24fd350ed.jpg"
              width="40"
            />
            <img
              alt="American Express card logo"
              className="h-5 object-contain"
              height="20"
              src="https://storage.googleapis.com/a1aa/image/57115398-72df-4b4f-9ed3-ef7618b62ff1.jpg"
              width="40"
            />
            <img
              alt="Discover card logo"
              className="h-5 object-contain"
              height="20"
              src="https://storage.googleapis.com/a1aa/image/93e0f9bf-523b-4005-7248-ab0d77c53559.jpg"
              width="40"
            />
            <img
              alt="PayPal logo"
              className="h-5 object-contain"
              height="20"
              src="https://storage.googleapis.com/a1aa/image/5ef7cacf-d3d0-49d7-4cd2-d413360c757e.jpg"
              width="40"
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-start">
            <p className="mr-2 whitespace-nowrap">© Copyright 2025</p>
            <p className="text-[#2ECC71] mr-6 whitespace-nowrap">Goemart</p>
            <p className="whitespace-nowrap">All Rights Reserved.</p>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <p className="whitespace-nowrap">Follow Us:</p>
            <button
              aria-label="Facebook"
              className="bg-[#1E2E3E] p-2 rounded-full hover:bg-[#2ECC71] transition-colors"
            >
              <i className="fab fa-facebook-f text-white"></i>
            </button>
            <button
              aria-label="Twitter"
              className="bg-[#1E2E3E] p-2 rounded-full hover:bg-[#2ECC71] transition-colors"
            >
              <i className="fab fa-twitter text-white"></i>
            </button>
            <button
              aria-label="LinkedIn"
              className="bg-[#1E2E3E] p-2 rounded-full hover:bg-[#2ECC71] transition-colors"
            >
              <i className="fab fa-linkedin-in text-white"></i>
            </button>
            <button
              aria-label="YouTube"
              className="bg-[#1E2E3E] p-2 rounded-full hover:bg-[#2ECC71] transition-colors"
            >
              <i className="fab fa-youtube text-white"></i>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
