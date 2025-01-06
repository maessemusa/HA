let notificationSound: HTMLAudioElement;

export const initializeSound = (audioUrl: string) => {
  notificationSound = new Audio(audioUrl);
};

export const playNotificationSound = () => {
  if (notificationSound) {
    notificationSound.currentTime = 0;
    notificationSound.play().catch(error => {
      console.warn('Error playing notification sound:', error);
    });
  }
};