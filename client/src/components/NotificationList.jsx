import { formatDistanceToNow } from "date-fns"

const NotificationList = ({ notifications, onMarkAsRead }) => {
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "Unknown time"
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
        <p className="text-gray-600">You're all caught up! No new notifications at this time.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md ${
            notification.read
              ? "bg-white border-gray-200 hover:border-gray-300"
              : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300 shadow-sm"
          }`}
        >
          {/* Unread indicator */}
          {!notification.read && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-400"></div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.read ? "bg-gray-100" : "bg-yellow-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${notification.read ? "text-gray-500" : "text-yellow-600"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-relaxed ${
                        notification.read ? "text-gray-700" : "text-gray-900 font-medium"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</p>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-sm flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationList
