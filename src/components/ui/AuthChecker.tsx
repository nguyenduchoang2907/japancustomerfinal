import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../redux/slices/auth.slice";
import { RootState, AppDispatch } from "../../redux/store";

const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [checking, setChecking] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const tokenExpires = localStorage.getItem("tokenExpires");

      if (!storedToken || !tokenExpires) {
        setAuthFailed(true);
        setChecking(false);
        return;
      }

      const expiresAt = new Date(tokenExpires).getTime();
      if (Date.now() >= expiresAt) {
        console.warn("Token đã hết hạn");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpires");
        setAuthFailed(true);
        setChecking(false);
        return;
      }

      try {
        await dispatch(getMe()).unwrap();
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpires");
        setAuthFailed(true);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // 👉 Sau khi kiểm tra xong mới điều hướng
  useEffect(() => {
    if (!checking && authFailed) {
      navigate("/account/login");
    }
  }, [checking, authFailed, navigate]);

  if (checking || !token || !user) {
    return <div>Đang xác thực...</div>;
  }

  return <>{children}</>;
};

export default AuthChecker;
