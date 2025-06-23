import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

export type NotificationType = 'promotion' | 'order' | 'table' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage on mount
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedNotifications = JSON.parse(savedNotifications).map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }));
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage', error);
      }
    }

    // Add some mock notifications for demo purposes
    const mockNotifications = [
      // {
      //   type: 'promotion' as NotificationType,
      //   title: 'Khuyến mãi đặc biệt!',
      //   message: 'Giảm 15% cho tất cả các món hải sản trong tuần này'
      // },
      // {
      //   type: 'order' as NotificationType,
      //   title: 'Đơn hàng #1234 đã được xác nhận',
      //   message: 'Đơn hàng của bạn đang được chuẩn bị và sẽ được giao trong 30 phút'
      // }
    ];

    if (notifications.length === 0) {
      mockNotifications.forEach(notification => {
        addNotification(notification);
      });
    }
  }, []);

  useEffect(() => {
    // Update unread count whenever notifications change
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);

    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
