import React from "react";
import "@ant-design/v5-patch-for-react-19";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyProfile from "./pages/MyProfile";
const App = () => {
  return (
    <div className="w-full bg-blue-50/60">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
