import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import { motion } from 'motion/react';
import { Facebook, MessageCircle } from 'lucide-react';
import useSound from 'use-sound';

const SocialSidebar: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (!settingsSnap.empty) {
        setSettings(settingsSnap.docs[0].data() as SiteSettings);
      }
    };
    fetchSettings();
  }, []);

  const whatsappNumber = settings?.whatsappNumber || '+201099321173';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s+/g, '').replace('+', '')}`;
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/TecnoSoftCAI';

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
      <motion.a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onMouseEnter={() => playHover()}
        onClick={() => playClick()}
        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1877F2] shadow-xl border border-slate-100 hover:scale-110 hover:-rotate-6 transition-all duration-300 group"
      >
        <Facebook className="w-6 h-6 group-hover:animate-pulse" />
        <div className="absolute left-full ml-4 px-3 py-1 bg-brand-ink text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          فيسبوك
        </div>
      </motion.a>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        onMouseEnter={() => playHover()}
        onClick={() => playClick()}
        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#25D366] shadow-xl border border-slate-100 hover:scale-110 hover:rotate-6 transition-all duration-300 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
        <div className="absolute left-full ml-4 px-3 py-1 bg-brand-ink text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          واتساب
        </div>
      </motion.a>
    </div>
  );
};

export default SocialSidebar;
