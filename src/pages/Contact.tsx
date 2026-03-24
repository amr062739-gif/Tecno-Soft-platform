import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import useSound from 'use-sound';

const Contact: React.FC = () => {
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    // Handle form submission logic here
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-brand-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-brand-ink mb-6 tracking-tight">
            تواصل <span className="text-brand-primary">معنا</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            نحن هنا للإجابة على استفساراتك ومساعدتك في رحلتك التعليمية. لا تتردد في الاتصال بنا.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card p-10 space-y-8">
              <h2 className="text-3xl font-black text-brand-ink mb-8">معلومات الاتصال</h2>
              
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-brand-ink mb-1">البريد الإلكتروني</h4>
                  <p className="text-slate-500 font-medium">info@tecnosoft.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-brand-ink mb-1">رقم الهاتف</h4>
                  <p className="text-slate-500 font-medium" dir="ltr">+20 109 932 1173</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-brand-ink mb-1">المقر الرئيسي</h4>
                  <p className="text-slate-500 font-medium">القاهرة، جمهورية مصر العربية</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-10 bg-brand-primary/5 border-brand-primary/10">
              <div className="flex items-center gap-4 mb-6">
                <MessageSquare className="w-8 h-8 text-brand-primary" />
                <h3 className="text-2xl font-black text-brand-ink">الدعم الفني</h3>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                فريق الدعم الفني لدينا متاح على مدار الساعة لمساعدتك في أي مشكلة تقنية قد تواجهها أثناء استخدام المنصة.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-10 space-y-6">
              <h2 className="text-3xl font-black text-brand-ink mb-8">أرسل لنا رسالة</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الاسم الكامل</label>
                  <input type="text" required className="input-field" placeholder="أدخل اسمك" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني</label>
                  <input type="email" required className="input-field" placeholder="example@mail.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الموضوع</label>
                <input type="text" required className="input-field" placeholder="كيف يمكننا مساعدتك؟" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الرسالة</label>
                <textarea required className="input-field h-40 resize-none" placeholder="اكتب رسالتك هنا..."></textarea>
              </div>

              <button
                type="submit"
                onMouseEnter={() => playHover()}
                className="btn-primary w-full py-5 text-lg group"
              >
                <span>إرسال الرسالة</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
