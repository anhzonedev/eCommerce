import React from "react";
import "@ant-design/v5-patch-for-react-19";
import AppRouter from "./router/AppRouter";
const App = () => {
  return (
    <div className="mx-auto bg-gray-50/30">
      <AppRouter />
    </div>
  );
};

export default App;
