import { FC, useState, useEffect } from 'react';
import { X, Bell, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import pb from '@/services/pocketbase';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  type: 'quest_update' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  created: string;
  link?: string;
}

const notificationIcons = {
  quest_update: Bell,
  payment: DollarSign,
  system: CheckCircle,
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await pb.collection('notifications').getList(1, 50, {
        sort: '-created',
      });
      setNotifications(result.items as unknown as Notification[]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await pb.collection('notifications').update(id, { read: true });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => pb.collection('notifications').update(n.id, { read: true }))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-xl z-50">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-display font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="font-mono text-xs text-primary hover:text-primary/80"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center font-mono text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => {
              const Icon = notificationIcons[notification.type] || Bell;
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <Icon className={`w-5 h-5 shrink-0 ${
                      notification.type === 'payment' ? 'text-kwestly-gold' :
                      notification.type === 'quest_update' ? 'text-primary' :
                      'text-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-foreground truncate">{notification.title}</p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="font-mono text-xs text-muted-foreground/60 mt-2">
                        {formatDistanceToNow(new Date(notification.created), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
