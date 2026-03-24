import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, BookOpen, Home, Info, Phone, Monitor } from 'lucide-react';
import { auth, db } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import useSound from 'use-sound';
import { collection, getDocs } from 'firebase/firestore';
import { SiteSettings } from '../types';

const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (!settingsSnap.empty) {
        setSiteSettings(settingsSnap.docs[0].data() as SiteSettings);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = async () => {
    playClick();
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
          >
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-brand-primary/50 transition-all duration-500 shadow-sm">
              <img src={siteSettings?.logoUrl || "/logo.png"} alt="TecnoSoft Logo" className="w-full h-full object-contain p-1" onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x400/f8fafc/3b82f6/png?text=TS';
              }} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-brand-ink leading-none tracking-tighter">
                تكنوسوفت
              </span>
              <span className="text-[9px] text-brand-primary font-black tracking-[0.2em] uppercase mt-1.5 opacity-80">
                للبرمجة والذكاء الاصطناعي
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/courses" 
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <BookOpen className="w-4 h-4" />
              <span>الكورسات</span>
            </Link>
            <Link 
              to="/software" 
              className="px-4 py-2 text-sm font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 hover:bg-brand-primary/10 rounded-xl transition-all flex items-center gap-2 group relative overflow-hidden"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Monitor className="w-4 h-4" />
              </motion.div>
              <span>البرامج ومواقع الويب</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <Info className="w-4 h-4" />
              <span>عن تكنوسوفت</span>
            </Link>
            <Link 
              to="/contact" 
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <Phone className="w-4 h-4" />
              <span>اتصل بنا</span>
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="px-4 py-2 text-sm font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 rounded-xl transition-all flex items-center gap-2"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-brand-ink leading-none">{profile?.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{profile?.role === 'admin' ? 'مسؤول النظام' : 'طالب'}</span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => playHover()}
                  className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary py-2 px-6 text-sm"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
              >
                دخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
