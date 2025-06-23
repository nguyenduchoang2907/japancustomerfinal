import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginUser, getMe, logout } from "../../redux/slices/auth.slice";
import { setMessage } from "../../redux/slices/message.slice";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { postLoginRequest } from "../../types/User";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [token, user, dispatch]);

useEffect(() => {
  if (!user) return;

  if (user.role === "customer") {
    dispatch(setMessage({ type: "success", message: "Đăng nhập thành công!" }));
    navigate("/", { replace: true });
  } else {
    dispatch(logout());
    dispatch(setMessage({ type: "error", message: "Chỉ khách hàng mới được phép đăng nhập." }));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user?.user_id]); // Chỉ theo dõi khi user xuất hiện


  const handleLogin = async (data: postLoginRequest) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (err) {
      dispatch(setMessage({ type: "error", message: "Đăng nhập thất bại" }));
      console.error("Lỗi đăng nhập:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#f9f5f0] bg-[url('/japan-texture.png')]">
      <div className="bg-white/60 backdrop-blur-md border border-red-300 shadow-lg rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#b03a2e] font-[Noto_Sans_JP]">
          Đăng nhập khách hàng
        </h2>
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          onForgotPasswordClick={() => navigate("/forgot-password")}
        />
        <div className="mt-4 text-center text-sm text-gray-700">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/account/register")}
            className="text-[#b03a2e] hover:underline cursor-pointer font-medium"
          >
            Đăng ký
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
