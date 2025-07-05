import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyProfile from '../pages/MyProfile';
import CreateSeller from '../pages/CreateSeller';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/create-seller" element={<CreateSeller />} />
    </Routes>
  );
}

export default AppRoutes;