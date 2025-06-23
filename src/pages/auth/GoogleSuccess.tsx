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
      try {
        const decodedTokenExpires = decodeURIComponent(tokenExpires);
        const expireDate = new Date(decodedTokenExpires);

        if (!isNaN(expireDate.getTime())) {
          const authData = {
            token,
            tokenExpires: expireDate.toISOString(),
            isLoggedIn: true,
          };

          localStorage.setItem("customerAuth", JSON.stringify(authData));

          console.log("✅ Saved to localStorage, navigating to /");
          navigate("/", { replace: true });
          return;
        } else {
          console.warn("❌ Expire date is invalid:", expireDate);
        }
      } catch (error) {
        console.error("❌ Failed to decode or parse expire date:", error);
      }
    }

    // Trường hợp lỗi hoặc thiếu param
    console.warn("❌ Missing token or tokenExpires, navigating to login");
    navigate("/account/login");
  }, [searchParams, navigate]);

  return <div>Đang xử lý đăng nhập bằng Google...</div>;
};

export default GoogleSuccess;
