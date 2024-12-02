import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Tags from './pages/Tags';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Carousel from './pages/Carousel';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AdminProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/tags" element={<Tags />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/carousel" element={<Carousel />} />
                  </Routes>
                </AdminLayout>
              }
            />
          </Routes>
        </AdminProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
