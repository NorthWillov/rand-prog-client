import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function RequireAuth({ children }) {
  let location = useLocation();
  const token = cookies.get("TOKEN");

  if (token) {
    return children;
  }
  return <Navigate to="/" state={{ from: location }} replace />;
}
