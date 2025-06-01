
import React from 'react';
import { Bell, Users, CheckCircle, Clock, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications: React.FC = () => {
  // Mock data for demonstration
  const initialNotifications = [
    {
      id: '1',
      type: 'join_request',
      title: 'New join request',
      message: 'John Doe has requested to join "Family Vacation 2024"',
      timestamp: '2024-01-20T10:30:00Z',
      isRead: false,
      actionRequired: true
    },
    {
      id: '2',
      type: 'join_approved',
      title: 'Join request approved',
      message: 'Your request to join "Weekend Hiking Trip" has been approved',
      timestamp: '2024-01-19T15:45:00Z',
      isRead: false,
      actionRequired: false
    },
    {
      id: '3',
      type: 'join_request',
      title: 'New join request',
      message: 'Sarah Wilson has requested to join "Business Conference"',
      timestamp: '2024-01-18T09:15:00Z',
      isRead: true,
      actionRequired: true
    },
    {
      id: '4',
      type: 'item_added',
      title: 'New item added',
      message: 'Mike added "Sunscreen" to "Beach Trip 2024" shopping list',
      timestamp: '2024-01-17T14:20:00Z',
      isRead: true,
      actionRequired: false
    }
  ];

  const {
    notifications,
    markAllAsRead,
    handleApprove,
    handleDecline,
    dismissNotification
  } = useNotifications(initialNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'join_request':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'join_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'item_added':
        return <Bell className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Stay updated with your group activities</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-semibold ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                      
                      {notification.actionRequired && (
                        <div className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDecline(notification.id)}
                          >
                            Decline
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(notification.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
