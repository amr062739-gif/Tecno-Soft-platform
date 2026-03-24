/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Contact from './pages/Contact';
import Software from './pages/Software';
import Auth from './pages/Auth';
import Payment from './pages/Payment';
import CourseView from './pages/CourseView';
import AdminDashboard from './components/AdminDashboard';
import Chatbot from './components/Chatbot';
import SocialSidebar from './components/SocialSidebar';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-ink bg-brand-dark">جاري التحميل...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brand-dark text-brand-ink font-sans selection:bg-brand-primary/10">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/software" element={<Software />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/payment/:courseId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/course/:courseId" element={<ProtectedRoute><CourseView /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
          <SocialSidebar />
          <Toaster position="top-center" theme="light" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}
