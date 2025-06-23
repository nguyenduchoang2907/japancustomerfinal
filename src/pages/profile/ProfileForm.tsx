import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../redux/slices/auth.slice';
import { RootState, AppDispatch } from '../../redux/store';
import {
  Card,
  Typography,
  Avatar,
  Descriptions,
  Alert,
  Button,
  Badge,
  Skeleton
} from 'antd';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer/Footer';

const { Title } = Typography;

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return (
        <Card style={{ maxWidth: 500, margin: '50px auto', textAlign: 'center' }}>
          <Skeleton.Avatar active size={100} style={{ marginBottom: 20 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      );
    }

    if (error) {
      return (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ margin: '20px' }}
        />
      );
    }

    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f2f5, #d6e4ff)',
          minHeight: 'calc(100vh - 64px - 70px)', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <Card
          style={{
            maxWidth: 800,
            height: 600,
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          <Avatar
            size={100}
            src={user?.avatar}
            style={{ marginBottom: 20, border: '3px solid #1890ff' }}
          />
          <Title level={2} style={{ marginBottom: 10 }}>
            {user?.name}
          </Title>
          <Badge
            color={user?.role === 'admin' ? 'red' : 'green'}
            text={user?.role.toUpperCase()}
            style={{ marginBottom: 20 }}
          />
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Username">{user?.username}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user?.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{user?.address}</Descriptions.Item>
          </Descriptions>
          <Link to="/edit-profile">
            <Button type="primary" size="large" style={{ marginTop: 20, width: '100%' }}>
              Chỉnh Sửa
            </Button>
          </Link>
        </Card>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>{renderContent()}</div>
      <Footer />
    </div>
  );
};

export default UserProfile;
