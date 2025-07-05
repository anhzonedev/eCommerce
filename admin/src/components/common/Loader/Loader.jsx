import React from "react";

const Loader = () => {
  return (
    <div className="loader-overlay flex items-center justify-center fixed inset-0 z-50">
    <div className="loader"></div>
    </div>
  );
};

export default Loader;
