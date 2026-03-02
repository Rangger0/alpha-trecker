// services/notification.ts
// Web Push Notification service
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
};

export const scheduleAirdropReminder = (airdropName: string, claimDate: Date) => {
  const now = new Date();
  const timeUntilClaim = claimDate.getTime() - now.getTime();
  
  if (timeUntilClaim > 0) {
    setTimeout(() => {
      sendNotification(`🎁 ${airdropName} Claim Ready!`, {
        body: "Your airdrop is now available to claim. Don't miss it!",
        tag: airdropName,
        requireInteraction: true
      });
    }, timeUntilClaim);
  }
};