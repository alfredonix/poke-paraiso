import { useEffect, useState } from 'react';
import '../styles/Notification.css';

function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">
        {type === 'error' && '⚠️'}
        {type === 'success' && '✓'}
        {type === 'warning' && '⚡'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="notification-message">{message}</span>
      <button
        className="notification-close"
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Notification;
