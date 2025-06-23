
import { useState } from 'react';
import { Bell, BellRing, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { NotificationType, useNotifications } from '@/context/NotificationContext';
import { format } from 'date-fns';

// Map notification types to their display attributes
const notificationTypeConfig: Record<NotificationType, { icon: React.ReactNode; bgColor: string; borderColor: string }> = {
  promotion: {
    icon: '🎁',
    bgColor: 'bg-gradient-to-r from-yellow-100 to-orange-100',
    borderColor: 'border-yellow-400',
  },
  order: {
    icon: '🍱',
    bgColor: 'bg-gradient-to-r from-blue-100 to-indigo-100',
    borderColor: 'border-blue-400',
  },
  table: {
    icon: '🪑',
    bgColor: 'bg-gradient-to-r from-green-100 to-emerald-100',
    borderColor: 'border-green-400',
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-gradient-to-r from-gray-100 to-slate-100',
    borderColor: 'border-gray-400',
  },
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative group hover:bg-japanese-sakura/20 transition-all duration-300"
        >
          <div className="relative">
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 animate-pulse text-japanese-sakura" />
            ) : (
              <Bell className="h-5 w-5 text-japanese-sumi group-hover:text-japanese-sakura transition-colors" />
            )}
            {unreadCount > 0 && (
              <>
                <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white p-0 animate-bounce shadow-lg">
                  {unreadCount}
                </Badge>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-spin" />
              </>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[360px] sm:w-[450px] japanese-card">
        <SheetHeader>
          <SheetTitle className="text-xl japanese-title flex items-center gap-2">
            <Bell className="h-5 w-5 text-japanese-sakura" />
            通知 (Thông báo)
          </SheetTitle>
          <div className="flex justify-between items-center mt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="zen-button text-xs bg-japanese-sakura/10 border-japanese-sakura/30 hover:bg-japanese-sakura/20"
            >
              全て既読 (Đánh dấu tất cả)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              className="zen-button text-xs bg-red-50 border-red-300 hover:bg-red-100 text-red-600"
            >
              全削除 (Xóa tất cả)
            </Button>
          </div>
        </SheetHeader>
        <Separator className="my-4 bg-japanese-sakura/30" />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-4xl mb-2 animate-float-slow">🌸</div>
            <p className="text-muted-foreground japanese-text">通知がありません</p>
            <p className="text-sm text-muted-foreground">Không có thông báo</p>
          </div>
        ) : (
          <div className="space-y-4 mt-5 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {notifications.map((notification, index) => {
              const { icon, bgColor, borderColor } = notificationTypeConfig[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${bgColor} ${
                    !notification.read ? `border-l-4 ${borderColor} shadow-md` : 'border border-gray-200'
                  } transition-all hover:brightness-95 hover:shadow-lg cursor-pointer transform hover:scale-102 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl animate-bounce-gentle">{icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium japanese-text flex items-center gap-1">
                        {notification.title}
                        {!notification.read && (
                          <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 japanese-text">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(notification.timestamp, 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
