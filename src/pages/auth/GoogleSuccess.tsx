import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const tokenExpires = searchParams.get("tokenExpires");

    console.log("✅ GoogleSuccess received:");
    console.log("Token:", token);
    console.log("TokenExpires:", tokenExpires);

    if (token && tokenExpires) {
      const expireDate = new Date(tokenExpires);

      console.log("Parsed expire date:", expireDate);

      if (!isNaN(expireDate.getTime())) {
        // ✅ Đồng bộ key với AuthChecker
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpires", expireDate.toISOString());

        console.log("✅ Saved to localStorage → Redirecting to /");
        navigate("/", { replace: true });
        return;
      } else {
        console.warn("❌ Expire date is invalid:", expireDate);
      }
    }

    console.warn("❌ Missing token or tokenExpires → Redirecting to login");
    navigate("/account/login");
  }, [searchParams, navigate]);

  return <div>Đang xử lý đăng nhập bằng Google...</div>;
};

export default GoogleSuccess;
