import toast from 'react-hot-toast';

/**
 * Centralized error handling service for frontend
 * Logs errors to console and displays user-friendly notifications
 */

export const errorService = {
  /**
   * Log error to console
   */
  log: (error, context = '') => {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      message: error.message || 'Unknown error',
      context,
      timestamp,
      stack: error.stack,
      statusCode: error.response?.status,
      responseData: error.response?.data,
    };

    console.error(`
╔════════════════════════════════════════╗
║       FRONTEND ERROR DETECTED          ║
╚════════════════════════════════════════╝
┌─ CONTEXT: ${context} ─────────────────────┐
│ Message: ${errorInfo.message.substring(0, 30).padEnd(30)} │
│ Status: ${String(errorInfo.statusCode || 'Client').padEnd(30)} │
│ Timestamp: ${timestamp.padEnd(28)} │
├─────────────────────────────────────┤
│ Stack Trace: ${errorInfo.stack?.substring(0, 25).padEnd(25)} │
│ Response Data: ${JSON.stringify(errorInfo.responseData).substring(0, 20)} │
└─────────────────────────────────────┘
    `, errorInfo);

    return errorInfo;
  },

  /**
   * Handle API errors with logging and toast notification
   */
  handleApiError: (error, customMessage = '') => {
    const errorInfo = errorService.log(error, 'API Call');

    const message =
      customMessage ||
      error.response?.data?.message ||
      error.message ||
      'An error occurred. Please try again.';

    toast.error(message, {
      duration: 4000,
      icon: '❌',
    });

    return errorInfo;
  },

  /**
   * Handle validation errors
   */
  handleValidationError: (errors, customMessage = '') => {
    const message = customMessage || 'Please check your input and try again.';

    console.warn(`
╔════════════════════════════════════════╗
║       VALIDATION ERROR                 ║
╚════════════════════════════════════════╝
Errors: ${JSON.stringify(errors)}
Timestamp: ${new Date().toISOString()}
    `, errors);

    toast.error(message, {
      duration: 4000,
      icon: '⚠️',
    });

    return { errors, timestamp: new Date().toISOString() };
  },

  /**
   * Handle network errors
   */
  handleNetworkError: (error) => {
    console.error(`
╔════════════════════════════════════════╗
║       NETWORK ERROR                    ║
╚════════════════════════════════════════╝
Message: ${error.message}
Timestamp: ${new Date().toISOString()}
    `);

    toast.error('Network error. Please check your connection.', {
      duration: 4000,
      icon: '🌐',
    });
  },

  /**
   * Show info toast
   */
  showInfo: (message) => {
    console.log(`
[INFO] ${new Date().toISOString()}
Message: ${message}
    `);
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
    });
  },

  /**
   * Show success toast
   */
  showSuccess: (message) => {
    console.log(`
╔════════════════════════════════════════╗
║       SUCCESS                          ║
╚════════════════════════════════════════╝
Message: ${message}
Timestamp: ${new Date().toISOString()}
    `);
    toast.success(message, {
      duration: 3000,
      icon: '✅',
    });
  },

  /**
   * Show warning toast
   */
  showWarning: (message) => {
    console.warn(`
╔════════════════════════════════════════╗
║       WARNING                          ║
╚════════════════════════════════════════╝
Message: ${message}
Timestamp: ${new Date().toISOString()}
    `);
    toast.loading(message, {
      duration: 3000,
      icon: '⚠️',
    });
  },
};

export default errorService;
