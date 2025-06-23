import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const tokenExpires = searchParams.get("tokenExpires");

    if (token && tokenExpires) {
      const expireDate = new Date(tokenExpires); 

      // Nếu giá trị hợp lệ
      if (!isNaN(expireDate.getTime())) {
        localStorage.setItem("customerAuth", JSON.stringify({
          token,
          tokenExpires: expireDate.toISOString(),
          isLoggedIn: true,
        }));

        navigate("/", { replace: true });
        return;
      }
    }

    // Trường hợp lỗi hoặc thiếu param
    navigate("/account/login");
  }, [searchParams, navigate]);

  return <div>Đang xử lý đăng nhập bằng Google...</div>;
};

export default GoogleSuccess;
