import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { registerUser } from "../../redux/slices/auth.slice";
import { RegisterLocalRequest } from "../../types/User";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import { message } from "antd"; // optional: dùng Ant Design cho toast

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleLoginClick = () => {
    navigate("/account/login");
  };

  const handleRegister = async (data: RegisterLocalRequest) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      message.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận."); // hoặc alert()
      navigate("/account/login");
    } catch (err) {
      message.error(err as string); // hoặc alert()
      console.error("Đăng ký thất bại:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        onLoginClick={handleLoginClick}
      />
      <div style={{ marginTop: "16px", fontSize: "14px" }}>
        Đã có tài khoản?{" "}
        <span
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={handleLoginClick}
        >
          Đăng nhập
        </span>
      </div>
    </div>
  );
};

export default Register;
