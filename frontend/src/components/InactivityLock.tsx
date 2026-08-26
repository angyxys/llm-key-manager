import React, { useEffect, useState } from 'react';
import { AlertCircle, Lock } from 'lucide-react';

interface InactivityLockProps {
  isEnabled: boolean;
  timeoutMinutes: number;
  onLock: () => void;
}

export const InactivityLock: React.FC<InactivityLockProps> = ({
  isEnabled,
  timeoutMinutes,
  onLock,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const handleActivity = () => {
      setTimeLeft(timeoutMinutes * 60);
      setShowWarning(false);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (newTime === 60) {
          setShowWarning(true);
        }

        if (newTime <= 0) {
          onLock();
          return timeoutMinutes * 60;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(timer);
    };
  }, [isEnabled, timeoutMinutes, onLock]);

  if (!isEnabled || !showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-red-900/90 border border-red-700 rounded-lg p-4 backdrop-blur-sm shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-100 mb-1">Inactivity Warning</p>
            <p className="text-sm text-red-200 mb-3">
              Your session will lock in {minutes}:{seconds.toString().padStart(2, '0')} due to inactivity.
            </p>
            <p className="text-xs text-red-300">Move your mouse or press any key to continue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
