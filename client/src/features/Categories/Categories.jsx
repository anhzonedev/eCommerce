import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
const Categories = () => {
  const { backendUrl } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/auth/public/parent-categories`
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-12 text-center my-6">
        <p className="text-green-600 font-semibold tracking-widest mb-2 uppercase">
          Danh mục của chúng tôi
        </p>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-10">
          Duyệt sản phẩm theo <span className="text-green-600">Danh mục</span>
        </h2>
        <ul className="flex flex-wrap justify-center gap-x-16 gap-y-10">
          {categories.map((category) => {
            return (
              <li className="flex flex-col items-center space-y-1 cursor-pointer group">
              <div className="bg-slate-100 rounded-full p-4 w-25 h-25 flex items-center justify-center text-5xl transition duration-300 group-hover:bg-primary text-black group-hover:text-white">
                <img
                alt={category.name}
                src={category.image || "/default-category.jpg"}
                className="w-full h-full transition duration-300 group-hover:brightness-0 group-hover:invert"
                />
              </div>
              <h1 className="font-semibold text-black/70 text-lg transition duration-300 group-hover:text-primary">
                {category.name}
              </h1>
              <p className="text-slate-500">
                {`${category.subCategoryCount} item`}
              </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Categories;
