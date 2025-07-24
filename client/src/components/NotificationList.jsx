import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotificationList = ({ notifications, onMarkAsRead }) => {
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border ${
            notification.read
              ? 'bg-gray-50 border-gray-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-800">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatTimestamp(notification.timestamp)}
              </p>
            </div>
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;