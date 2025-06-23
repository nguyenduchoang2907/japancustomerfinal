import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    alert("🟢 GoogleSuccess mounted");

    const token = searchParams.get("token");
    const tokenExpires = searchParams.get("tokenExpires");

    alert("Token: " + token);
    alert("TokenExpires: " + tokenExpires);

    if (token && tokenExpires) {
      try {
        const decodedTokenExpires = decodeURIComponent(tokenExpires);
        const expireDate = new Date(decodedTokenExpires);

        alert("Parsed expire date: " + expireDate.toISOString());

        if (!isNaN(expireDate.getTime())) {
          const authData = {
            token,
            tokenExpires: expireDate.toISOString(),
            isLoggedIn: true,
          };

          localStorage.setItem("customerAuth", JSON.stringify(authData));

          alert("✅ Saved to localStorage → Redirecting to /");
          navigate("/", { replace: true });
          return;
        } else {
          alert("❌ Invalid expire date: " + expireDate.toString());
        }
      } catch (error) {
        alert("❌ Error decoding tokenExpires: " + String(error));
      }
    }

    alert("❌ Missing token or tokenExpires → Redirecting to login");
    navigate("/account/login");
  }, [searchParams, navigate]);

  return <div>Đang xử lý đăng nhập bằng Google...</div>;
};

export default GoogleSuccess;
