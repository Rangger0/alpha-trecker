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
        return <CheckCircle className="w-5 h-5 text-[#00FF88]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />;
      case 'error':
        return <X className="w-5 h-5 text-[#EF4444]" />;
      default:
        return <Info className="w-5 h-5 text-[#3B82F6]" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return isDark ? 'bg-[#00FF88]/10 border-[#00FF88]/20' : 'bg-[#10B981]/10 border-[#10B981]/20';
      case 'warning':
        return isDark ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20' : 'bg-[#EA580C]/10 border-[#EA580C]/20';
      case 'error':
        return isDark ? 'bg-[#EF4444]/10 border-[#EF4444]/20' : 'bg-[#DC2626]/10 border-[#DC2626]/20';
      default:
        return isDark ? 'bg-[#3B82F6]/10 border-[#3B82F6]/20' : 'bg-[#2563EB]/10 border-[#2563EB]/20';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded border transition-colors ${
          isDark 
            ? 'text-[#6B7280] border-[#1F2937] hover:bg-[#00FF88]/10 hover:text-[#00FF88]' 
            : 'text-[#6B7280] border-[#E5E7EB] hover:bg-[#2563EB]/10 hover:text-[#2563EB]'
        }`}
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
            isDark ? 'bg-[#00FF88] text-[#0B0F14]' : 'bg-[#2563EB] text-white'
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
              ? 'bg-[#161B22] border-[#1F2937]' 
              : 'bg-white border-[#E5E7EB]'
          }`}>
            <div className={`flex items-center justify-between p-3 border-b ${
              isDark ? 'border-[#1F2937]' : 'border-[#E5E7EB]'
            }`}>
              <h3 className={`font-mono font-bold ${
                isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
              }`}>
                NOTIFICATIONS
              </h3>
              <button
                onClick={() => setNotifications([])}
                className={`text-xs font-mono ${
                  isDark ? 'text-[#6B7280] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                CLEAR_ALL
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`p-4 text-center font-mono text-sm ${
                  isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
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
                            isDark ? 'text-[#E5E7EB]' : 'text-[#111827]'
                          }`}>
                            {notification.title}
                          </p>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className={`p-1 rounded ${
                              isDark ? 'text-[#6B7280] hover:bg-[#1F2937]' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className={`font-mono text-xs mt-1 ${
                          isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`font-mono text-[10px] mt-1 ${
                          isDark ? 'text-[#374151]' : 'text-[#9CA3AF]'
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