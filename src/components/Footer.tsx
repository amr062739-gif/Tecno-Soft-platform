import React, { useEffect, useState } from 'react';
import { BookOpen, Github, Twitter, Instagram, Mail, Facebook } from 'lucide-react';
import useSound from 'use-sound';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

const Footer: React.FC = () => {
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

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center overflow-hidden border border-brand-primary/20 shadow-sm">
              <img src={siteSettings?.logoUrl || "/logo.png"} alt="TecnoSoft Logo" className="w-full h-full object-contain p-1" onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x400/f8fafc/3b82f6/png?text=TS';
              }} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent tracking-tighter">
                تكنوسوفت
              </span>
              <span className="text-[10px] text-brand-primary font-black tracking-[0.2em] uppercase mt-1 opacity-80">
                للبرمجة والذكاء الاصطناعي
              </span>
            </div>
          </div>
          <p className="text-slate-500 max-w-md leading-relaxed font-medium text-lg">
            منصتك الأولى لتعلم البرمجة والذكاء الاصطناعي. نهدف إلى تمكين الشباب العربي من امتلاك أدوات المستقبل من خلال محتوى تعليمي عالي الجودة ومبسط.
          </p>
        </div>

        <div>
          <h4 className="text-brand-ink font-black mb-8 uppercase tracking-widest text-xs">روابط سريعة</h4>
          <ul className="space-y-4 text-slate-500 font-bold">
            <li><a href="/" onMouseEnter={() => playHover()} onClick={() => playClick()} className="hover:text-brand-primary transition-colors">الرئيسية</a></li>
            <li><a href="/courses" onMouseEnter={() => playHover()} onClick={() => playClick()} className="hover:text-brand-primary transition-colors">الكورسات</a></li>
            <li><a href="/software" onMouseEnter={() => playHover()} onClick={() => playClick()} className="hover:text-brand-primary transition-colors">البرامج ومواقع الويب</a></li>
            <li><a href="/about" onMouseEnter={() => playHover()} onClick={() => playClick()} className="hover:text-brand-primary transition-colors">عن تكنوسوفت</a></li>
            <li><a href="/contact" onMouseEnter={() => playHover()} onClick={() => playClick()} className="hover:text-brand-primary transition-colors">اتصل بنا</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-ink font-black mb-8 uppercase tracking-widest text-xs">تواصل معنا</h4>
          <div className="flex space-x-4 mb-8">
            <a href={siteSettings?.facebookUrl || "https://www.facebook.com/TecnoSoftCAI"} target="_blank" rel="noopener noreferrer" onMouseEnter={() => playHover()} onClick={() => playClick()} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all duration-300">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" onMouseEnter={() => playHover()} onClick={() => playClick()} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" onMouseEnter={() => playHover()} onClick={() => playClick()} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-300">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <div className="flex items-center space-x-3 text-slate-500 font-black text-sm">
            <Mail className="w-4 h-4 text-brand-primary" />
            <span>support@tecnosoft.com</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
        <p>© {new Date().getFullYear()} تكنوسوفت للبرمجة والذكاء الاصطناعي والتدريب. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
