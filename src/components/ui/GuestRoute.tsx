import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpires = localStorage.getItem("tokenExpires");

    if (!token || !tokenExpires) {
      setChecking(false);
      return;
    }

    const expiresAt = new Date(tokenExpires).getTime();
    const isTokenValid = Date.now() < expiresAt;

    // Nếu đang ở login/register mà token hợp lệ → chuẩn bị redirect
    if (isTokenValid && ["/account/login", "/account/register"].includes(location.pathname)) {
      setShouldRedirect(true);
    }

    setChecking(false);
  }, [location.pathname]);

  if (checking) return <div>Đang kiểm tra...</div>;

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
export default GuestRoute