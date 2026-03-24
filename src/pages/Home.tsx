import React, { useEffect, useState } from 'react';
import { collection, query, limit, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, SiteSettings, Advertisement } from '../types';
import CourseCard from '../components/CourseCard';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Code, Brain, Monitor, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      
      if (coursesData.length === 0) {
        setFeaturedCourses([
          { id: 'demo-p1', title: 'أساسيات البرمجة بلغة Python', category: 'Programming', description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون.', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', price: 0, isFree: true, createdAt: Timestamp.now() },
          { id: 'demo-a1', title: 'مقدمة في الذكاء الاصطناعي', category: 'AI', description: 'استكشف عالم الذكاء الاصطناعي وتعلم المفاهيم الأساسية.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', price: 500, isFree: false, createdAt: Timestamp.now() },
          { id: 'demo-u1', title: 'هياكل البيانات والخوارزميات (جامعي)', category: 'University', description: 'شرح مفصل لمادة هياكل البيانات والخوارزميات لطلاب كليات الحاسبات.', imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=8hly31xKli0', price: 400, isFree: false, createdAt: Timestamp.now() }
        ]);
      } else {
        setFeaturedCourses(coursesData);
      }

      const adsSnap = await getDocs(query(collection(db, 'advertisements'), orderBy('createdAt', 'desc')));
      const adsData = adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement));
      
      if (adsData.length === 0) {
        // Fallback demo ads if database is empty
        setAdvertisements([
          { id: 'demo1', imageUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a5f452?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
          { id: 'demo2', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
          { id: 'demo3', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
          { id: 'demo4', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
          { id: 'demo5', imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() }
        ]);
      } else {
        setAdvertisements(adsData);
      }

      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (!settingsSnap.empty) {
        setSiteSettings(settingsSnap.docs[0].data() as SiteSettings);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (advertisements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [advertisements]);

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-multiply" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-12 bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] p-6 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src={siteSettings?.logoUrl || "/logo.png"} alt="TecnoSoft Logo" className="w-full h-full object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-700" onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x400/f8fafc/3b82f6/png?text=TS';
              }} />
            </motion.div>

            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 mb-8 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
              </span>
              <span className="text-xs font-black text-brand-primary tracking-[0.2em] uppercase">نبني جيلاً جديداً واعياً</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-brand-ink mb-8 tracking-tighter leading-[1.1]">
              مرحباً بك في <br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">
                تكنوسوفت
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              الرائد في تعليم البرمجة والذكاء الاصطناعي. انضم إلينا اليوم وابدأ رحلتك نحو الاحتراف.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/courses"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
                className="btn-primary py-5 px-10 text-lg group"
              >
                <span>ابدأ التعلم الآن</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/auth"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
                className="btn-secondary py-5 px-10 text-lg"
              >
                انضم مجاناً
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-300 rounded-full" />
          </div>
        </div>
      </section>

      {/* Advertisement Slider */}
      {advertisements.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-brand-ink">أحدث العروض والإعلانات</h2>
            <div className="w-20 h-1.5 bg-brand-primary mx-auto mt-4 rounded-full" />
          </div>
          <div className="relative h-[200px] md:h-[400px] w-full overflow-hidden rounded-[3rem] shadow-2xl border border-slate-200 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAdIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {advertisements[currentAdIndex].linkUrl ? (
                  <a 
                    href={advertisements[currentAdIndex].linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img 
                      src={advertisements[currentAdIndex].imageUrl} 
                      alt="Advertisement" 
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <img 
                    src={advertisements[currentAdIndex].imageUrl} 
                    alt="Advertisement" 
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {advertisements.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { playClick(); setCurrentAdIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length); }}
                    className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => { playClick(); setCurrentAdIndex((prev) => (prev + 1) % advertisements.length); }}
                    className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {advertisements.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { playClick(); setCurrentAdIndex(idx); }}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentAdIndex ? 'bg-white w-8' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Features Section - Bento Grid Style */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-brand-ink mb-6">لماذا تختار تكنوسوفت؟</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">نحن نوفر لك كل ما تحتاجه لتنتقل من مرحلة المبتدئ إلى الاحتراف في سوق العمل.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => playHover()}
            className="md:col-span-2 glass-card p-12 flex flex-col justify-between group"
          >
            <div>
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Code className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-3xl font-black text-brand-ink mb-4">مسارات برمجية متكاملة</h3>
              <p className="text-slate-500 text-lg max-w-md font-medium">نغطي أشهر لغات البرمجة مثل Python, JavaScript, و C++ مع تطبيقات عملية حقيقية.</p>
            </div>
            <div className="mt-12 flex gap-3">
              {['Web Dev', 'Mobile Apps', 'Backend'].map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onMouseEnter={() => playHover()}
            className="glass-card p-12 flex flex-col justify-between group"
          >
            <div>
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Brain className="w-8 h-8 text-brand-accent" />
              </div>
              <h3 className="text-3xl font-black text-brand-ink mb-4">ذكاء اصطناعي</h3>
              <p className="text-slate-500 text-lg font-medium">تعلم كيف تبني نماذج الذكاء الاصطناعي وتستخدمها في تطوير أعمالك.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => playHover()}
            className="glass-card p-12 flex flex-col justify-between group"
          >
            <div>
              <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Monitor className="w-8 h-8 text-brand-secondary" />
              </div>
              <h3 className="text-3xl font-black text-brand-ink mb-4">تطبيقات عملية</h3>
              <p className="text-slate-500 text-lg font-medium">لا نكتفي بالشرح النظري، بل نركز على بناء مشاريع حقيقية تضاف لمعرض أعمالك.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onMouseEnter={() => playHover()}
            className="md:col-span-2 glass-card p-12 flex flex-col md:flex-row items-center gap-12 group"
          >
            <div className="flex-1">
              <h3 className="text-3xl font-black text-brand-ink mb-4">شهادات معتمدة</h3>
              <p className="text-slate-500 text-lg font-medium">احصل على شهادة إتمام عند نهاية كل كورس لتعزز بها سيرتك الذاتية في سوق العمل.</p>
            </div>
            <div className="w-56 h-56 bg-brand-primary/5 rounded-full flex items-center justify-center border border-brand-primary/10 group-hover:rotate-12 transition-transform duration-700">
              <Sparkles className="w-24 h-24 text-brand-primary opacity-30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-32 px-4 max-w-7xl mx-auto bg-slate-50 rounded-[4rem] border border-slate-200">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 px-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-ink mb-4">أحدث الكورسات</h2>
            <p className="text-slate-500 font-medium">ابدأ رحلتك التعليمية مع أحدث ما وصلنا من دورات تدريبية.</p>
          </div>
          <Link 
            to="/courses" 
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="btn-secondary py-4 px-10 text-sm flex items-center gap-3"
          >
            <span>عرض كل الكورسات</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-12">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
