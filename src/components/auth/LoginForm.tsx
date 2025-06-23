import { Form, Input, Button, Alert, Typography, Card, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, SmileOutlined } from "@ant-design/icons";
import { postLoginRequest } from "../../types/User";

const { Title, Text } = Typography;

interface LoginFormProps {
  onSubmit: (data: postLoginRequest) => void;
  loading: boolean;
  error: string | null;
  onForgotPasswordClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
  onForgotPasswordClick,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: postLoginRequest) => {
    onSubmit(values);
    form.resetFields();
  };
const handleGoogleLogin = () => {
  window.location.href = 'https://api.vnpt-hn.io.vn/api/account/auth/google';
};

  return (
    <Card
      title={
        <div className="text-center">
          <SmileOutlined style={{ fontSize: 24, color: "#eb2f96", marginBottom: 4 }} />
          <Title level={3} className="mb-0 text-black dark:text-white">
            Đăng nhập khách hàng
          </Title>
        </div>
      }
      className="w-full max-w-md mx-auto"
      bordered={false}
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 12 }}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            placeholder="you@example.com"
            autoComplete="email"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="••••••••"
            autoComplete="current-password"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        {onForgotPasswordClick && (
          <div className="text-right mb-4">
            <Button type="link" onClick={onForgotPasswordClick}>
              Quên mật khẩu?
            </Button>
          </div>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>hoặc</Divider>

      <Button
        icon={<GoogleOutlined />}
        block
        onClick={handleGoogleLogin}
        style={{ backgroundColor: "#fff", borderColor: "#d9d9d9" }}
      >
        Đăng nhập bằng Google
      </Button>
    </Card>
  );
};

export default LoginForm;
