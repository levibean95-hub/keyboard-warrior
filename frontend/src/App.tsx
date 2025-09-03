import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArgumentProvider } from './context/ArgumentContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const SetupPage = React.lazy(() => import('./pages/SetupPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));

function App() {
  return (
    <ErrorBoundary>
      <ArgumentProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#374151',
                  color: '#fff',
                  border: '1px solid #6366f1'
                }
              }}
            />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<SetupPage />} />
                <Route path="/chat/:conversationId" element={<ChatPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ArgumentProvider>
    </ErrorBoundary>
  );
}

export default App;
