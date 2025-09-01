import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArgumentProvider } from './context/ArgumentContext';
import SetupPage from './pages/SetupPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <ArgumentProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />
          </Routes>
        </div>
      </Router>
    </ArgumentProvider>
  );
}

export default App;