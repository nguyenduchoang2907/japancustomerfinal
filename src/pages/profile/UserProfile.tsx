import { Button, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/auth.slice";
import { RootState } from "../../redux/store";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/account/login");
  };

  const menuItems = [
    {
      key: "greeting",
      label: (
        <div className="px-3 py-2 text-sm text-gray-500">
          こんにちは, <span className="font-semibold text-gray-700">{user?.name || "Người dùng"}</span>
        </div>
      ),
      disabled: true,
    },
    {
      key: "profile",
      label: (
        <Link to="/profile" className="text-sm">
          <UserOutlined style={{ marginRight: 8 }} />
          Hồ sơ cá nhân
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="text-sm px-0"
        >
          Đăng xuất
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <span className="cursor-pointer inline-block hover:opacity-90 transition-opacity">
        <img
          src={user?.avatar}
          alt="Avatar"
          className="rounded-full w-9 h-9 object-cover border border-gray-200 shadow-sm"
        />
      </span>
    </Dropdown>
  );
};

export default UserProfile;
