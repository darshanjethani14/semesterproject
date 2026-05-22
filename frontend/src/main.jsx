import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error(`
╔════════════════════════════════════════╗
║    UNHANDLED PROMISE REJECTION         ║
╚════════════════════════════════════════╝
Reason: ${event.reason}
Timestamp: ${new Date().toISOString()}
Stack: ${event.reason?.stack || 'N/A'}
  `);
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error(`
╔════════════════════════════════════════╗
║       GLOBAL ERROR CAUGHT              ║
╚════════════════════════════════════════╝
Message: ${event.message}
Filename: ${event.filename}
Line: ${event.lineno}
Column: ${event.colno}
Timestamp: ${new Date().toISOString()}
Stack: ${event.error?.stack || 'N/A'}
  `);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                className: 'dark:!bg-gray-800 dark:!text-white',
              }}
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
