import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

export const Notification: React.FC = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const isDark = theme === 'dark';

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        type: 'success',
        title: 'Airdrop Claimed',
        message: 'You successfully claimed 500 TOKEN from Project X',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'warning',
        title: 'Claim Deadline',
        message: 'Project Y claim ends in 24 hours',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        type: 'info',
        title: 'New Project Added',
        message: 'LayerZero airdrop added to tracker',
        timestamp: new Date(Date.now() - 7200000)
      }
    ]);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[var(--alpha-signal)]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[var(--alpha-warning)]" />;
      case 'error':
        return <X className="w-5 h-5 text-[var(--alpha-danger)]" />;
      default:
        return <Info className="w-5 h-5 text-[var(--alpha-signal)]" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return isDark ? 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]';
      case 'warning':
        return isDark ? 'bg-[var(--alpha-warning-soft)] border-[var(--alpha-warning-border)]' : 'bg-[var(--alpha-warning-soft)] border-[var(--alpha-warning-border)]';
      case 'error':
        return isDark ? 'bg-[var(--alpha-danger-soft)] border-[var(--alpha-danger-border)]' : 'bg-[var(--alpha-danger-soft)] border-[var(--alpha-danger-border)]';
      default:
        return isDark ? 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]' : 'bg-[var(--alpha-signal-soft)] border-[var(--alpha-signal-border)]';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded border transition-colors ${
          isDark 
            ? 'text-[var(--alpha-text-muted)] border-[var(--alpha-border)] hover:bg-[var(--alpha-signal-soft)] hover:text-[var(--alpha-signal)]' 
            : 'text-[var(--alpha-text-muted)] border-[var(--alpha-border)] hover:bg-[var(--alpha-signal-soft)] hover:text-[var(--alpha-signal)]'
        }`}
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
            isDark ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)]' : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)]'
          }`}>
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-xl z-50 ${
            isDark 
              ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' 
              : 'bg-[var(--alpha-panel)] border-[var(--alpha-border)]'
          }`}>
            <div className={`flex items-center justify-between p-3 border-b ${
              isDark ? 'border-[var(--alpha-border)]' : 'border-[var(--alpha-border)]'
            }`}>
              <h3 className={`font-mono font-bold ${
                isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
              }`}>
                NOTIFICATIONS
              </h3>
              <button
                onClick={() => setNotifications([])}
                className={`text-xs font-mono ${
                  isDark ? 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-text)]' : 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-text)]'
                }`}
              >
                CLEAR_ALL
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`p-4 text-center font-mono text-sm ${
                  isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                }`}>
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b last:border-b-0 ${getBgColor(notification.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-mono text-sm font-bold ${
                            isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'
                          }`}>
                            {notification.title}
                          </p>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className={`p-1 rounded ${
                              isDark ? 'text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)]' : 'text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)]'
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className={`font-mono text-xs mt-1 ${
                          isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`font-mono text-[10px] mt-1 ${
                          isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'
                        }`}>
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
