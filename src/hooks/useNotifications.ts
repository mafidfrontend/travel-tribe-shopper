
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
}

export const useNotifications = (initialNotifications: Notification[]) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const handleApprove = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Approved",
      description: "Join request has been approved",
    });
  };

  const handleDecline = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Declined",
      description: "Join request has been declined",
    });
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return {
    notifications,
    markAllAsRead,
    handleApprove,
    handleDecline,
    dismissNotification
  };
};
