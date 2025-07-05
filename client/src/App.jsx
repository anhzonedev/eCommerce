import React from "react";
import "@ant-design/v5-patch-for-react-19";
import Footer from "./components/layout/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar/Navbar";
const App = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
};

export default App;
