import React, { useContext } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import AdminPages from "../pages/AdminPages";
import Users from "../features/Users/Users";
import UserDetails from "../features/Users/UserDetails";
import Dashboard from "../features/Dashboard/Dashboard";
import Login from "../pages/Login";
import { AppContext } from "../context/AppContext";
import Products from "../features/Products/Products";
import AddBanner from "../features/Banner/AddBanner";
import Banners from "../features/Banner/Banners";
import Categories from "../features/Categories/Categories";
import AddCategory from "../features/Categories/AddCategory";
import AddSubCategory from "../features/Categories/AddSubCategory";

const ProtectedRoute = ({ token, redirectPath = "/login" }) => {
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

const AppRouter = () => {
  const { token } = useContext(AppContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route element={<ProtectedRoute token={token} />}>
          <Route path="/admin" element={<AdminPages />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userID" element={<UserDetails />} />
            <Route path="products" element={<Products />} />
            <Route path="banners" element={<Banners />} />
            <Route path="add-banner" element={<AddBanner />} />
            <Route path="categories" element={<Categories />} />
            <Route path="create-category" element={<AddCategory />} />
            <Route path="/admin/add-subcategory" element={<AddSubCategory />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
