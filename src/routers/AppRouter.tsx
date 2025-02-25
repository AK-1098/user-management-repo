// src/routes/AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import UsersList from "../pages/UsersList";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AppRouter: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  console.log(token, "token");
  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/users" /> : <Login />} />
      <Route path="/users" element={token ? <UsersList /> : <Login />} />
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
};

export default AppRouter;
