import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Enrollment, UserProfile, ChatbotKnowledge, SiteSettings, Advertisement } from '../types';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { Plus, Trash2, Check, X, Users, BookOpen, DollarSign, Eye, MessageSquare, Settings as SettingsIcon, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import useSound from 'use-sound';
import { CATEGORY_NAMES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'enrollments' | 'chatbot' | 'settings' | 'ads'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [chatbotKnowledge, setChatbotKnowledge] = useState<ChatbotKnowledge[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', { volume: 0.2 });
  const [playDelete] = useSound('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', { volume: 0.2 });

  // Form states
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    price: 0,
    isFree: false,
    category: 'Programming'
  });

  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    question: '',
    answer: ''
  });

  const [showAddAd, setShowAddAd] = useState(false);
  const [newAd, setNewAd] = useState({
    imageUrl: '',
    linkUrl: ''
  });

  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [facebookUrlInput, setFacebookUrlInput] = useState('');
  const [whatsappNumberInput, setWhatsappNumberInput] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      try {
        const coursesSnap = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
        setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));

        const usersSnap = await getDocs(collection(db, 'users'));
        setUsers(usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));

        const enrollmentsSnap = await getDocs(query(collection(db, 'enrollments'), orderBy('createdAt', 'desc')));
        setEnrollments(enrollmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment)));

        const chatbotSnap = await getDocs(query(collection(db, 'chatbot_knowledge'), orderBy('createdAt', 'desc')));
        setChatbotKnowledge(chatbotSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatbotKnowledge)));

        const adsSnap = await getDocs(query(collection(db, 'advertisements'), orderBy('createdAt', 'desc')));
        setAdvertisements(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement)));

        const settingsSnap = await getDocs(collection(db, 'settings'));
        if (!settingsSnap.empty) {
          const settings = settingsSnap.docs[0].data() as SiteSettings;
          setSiteSettings(settings);
          setLogoUrlInput(settings.logoUrl);
          setFacebookUrlInput(settings.facebookUrl || '');
          setWhatsappNumberInput(settings.whatsappNumber || '');
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    try {
      await addDoc(collection(db, 'courses'), {
        ...newCourse,
        createdAt: Timestamp.now()
      });
      playSuccess();
      toast.success('تم إضافة الكورس بنجاح');
      setShowAddCourse(false);
      // Refresh
      const coursesSnap = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
      setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    } catch (error) {
      toast.error('خطأ في إضافة الكورس');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    playClick();
    if (!window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      setCourses(courses.filter(c => c.id !== id));
      playDelete();
      toast.success('تم الحذف');
    } catch (error) {
      toast.error('خطأ في الحذف');
    }
  };

  const handleEnrollmentStatus = async (id: string, status: 'approved' | 'rejected') => {
    playClick();
    try {
      await updateDoc(doc(db, 'enrollments', id), { status });
      setEnrollments(enrollments.map(e => e.id === id ? { ...e, status } : e));
      playSuccess();
      toast.success(status === 'approved' ? 'تم تفعيل الاشتراك' : 'تم رفض الاشتراك');
    } catch (error) {
      toast.error('خطأ في التحديث');
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    try {
      await addDoc(collection(db, 'chatbot_knowledge'), {
        ...newKnowledge,
        createdAt: Timestamp.now()
      });
      playSuccess();
      toast.success('تم إضافة السؤال بنجاح');
      setShowAddKnowledge(false);
      setNewKnowledge({ question: '', answer: '' });
      const chatbotSnap = await getDocs(query(collection(db, 'chatbot_knowledge'), orderBy('createdAt', 'desc')));
      setChatbotKnowledge(chatbotSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatbotKnowledge)));
    } catch (error) {
      toast.error('خطأ في الإضافة');
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    playClick();
    if (!window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    try {
      await deleteDoc(doc(db, 'chatbot_knowledge', id));
      setChatbotKnowledge(chatbotKnowledge.filter(k => k.id !== id));
      playDelete();
      toast.success('تم الحذف');
    } catch (error) {
      toast.error('خطأ في الحذف');
    }
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    try {
      const adData = {
        ...newAd,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'advertisements'), adData);
      setAdvertisements([{ id: docRef.id, ...adData } as Advertisement, ...advertisements]);
      playSuccess();
      toast.success('تم إضافة الإعلان بنجاح');
      setShowAddAd(false);
      setNewAd({ imageUrl: '', linkUrl: '' });
    } catch (error) {
      toast.error('خطأ في إضافة الإعلان');
    }
  };

  const handleDeleteAd = async (id: string) => {
    playClick();
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await deleteDoc(doc(db, 'advertisements', id));
      setAdvertisements(advertisements.filter(ad => ad.id !== id));
      playDelete();
      toast.success('تم الحذف');
    } catch (error) {
      toast.error('خطأ في الحذف');
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    try {
      const settingsSnap = await getDocs(collection(db, 'settings'));
      const settingsData = {
        logoUrl: logoUrlInput,
        facebookUrl: facebookUrlInput,
        whatsappNumber: whatsappNumberInput,
        updatedAt: Timestamp.now()
      };

      if (settingsSnap.empty) {
        await addDoc(collection(db, 'settings'), settingsData);
      } else {
        await updateDoc(doc(db, 'settings', settingsSnap.docs[0].id), settingsData);
      }
      
      setSiteSettings(settingsData as SiteSettings);
      playSuccess();
      toast.success('تم تحديث الإعدادات بنجاح');
    } catch (error) {
      toast.error('خطأ في تحديث الإعدادات');
    }
  };

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-brand-ink bg-brand-dark">غير مسموح لك بالدخول</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-ink bg-brand-dark">جاري تحميل البيانات...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto bg-brand-dark">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-72 space-y-3">
          <div className="glass-card p-6 mb-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-lg mb-4 p-2">
              <img src="/logo.png" alt="TecnoSoft Logo" className="w-full h-full object-contain" onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x400/f8fafc/3b82f6/png?text=TS';
              }} />
            </div>
            <h1 className="text-xl font-black text-brand-ink mb-1">لوحة التحكم</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-70">تكنوسوفت</p>
          </div>
          
          <button
            onClick={() => { playClick(); setActiveTab('courses'); }}
            onMouseEnter={() => playHover()}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'courses' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-400 hover:bg-white hover:text-brand-primary'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-black">إدارة الكورسات</span>
          </button>
          
          <button
            onClick={() => { playClick(); setActiveTab('enrollments'); }}
            onMouseEnter={() => playHover()}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'enrollments' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-400 hover:bg-white hover:text-brand-primary'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-black">طلبات الدفع</span>
          </button>
          
          <button
            onClick={() => { playClick(); setActiveTab('users'); }}
            onMouseEnter={() => playHover()}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'users' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-400 hover:bg-white hover:text-brand-primary'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-black">المستخدمين</span>
          </button>

          <button
            onClick={() => { playClick(); setActiveTab('chatbot'); }}
            onMouseEnter={() => playHover()}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'chatbot' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-400 hover:bg-white hover:text-brand-primary'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-black">الشات بوت</span>
          </button>

          <button
            onClick={() => { playClick(); setActiveTab('ads'); }}
            onMouseEnter={() => playHover()}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'ads' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-400 hover:bg-white hover:text-brand-primary'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-black">إدارة الإعلانات</span>
          </button>

          <button
            onClick={() => { playClick(); setActiveTab('settings'); }}
            onMouseEnter={() => playHover()}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'settings' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-slate-400 hover:bg-white hover:text-brand-primary'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-black">إعدادات الموقع</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-10">
          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-brand-ink">إدارة الكورسات</h2>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      playClick();
                      const demoCourses = [
                        { title: 'أساسيات البرمجة بلغة Python', category: 'Programming', description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون.', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', price: 0, isFree: true, createdAt: Timestamp.now() },
                        { title: 'مقدمة في الذكاء الاصطناعي', category: 'AI', description: 'استكشف عالم الذكاء الاصطناعي وتعلم المفاهيم الأساسية.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', price: 500, isFree: false, createdAt: Timestamp.now() },
                        { title: 'تصميم واجهات المستخدم UI/UX', category: 'Design', description: 'تعلم كيفية تصميم واجهات مستخدم جذابة وسهلة الاستخدام.', imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=c9Wg6ndoxag', price: 300, isFree: false, createdAt: Timestamp.now() },
                        { title: 'احتراف Microsoft Excel', category: 'Office', description: 'اتقن استخدام برنامج إكسيل من الجداول البسيطة إلى المعادلات المعقدة.', imageUrl: 'https://images.unsplash.com/photo-1591696208162-a97b7417444c?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', price: 150, isFree: false, createdAt: Timestamp.now() },
                        { title: 'هياكل البيانات والخوارزميات (جامعي)', category: 'University', description: 'شرح مفصل لمادة هياكل البيانات والخوارزميات لطلاب كليات الحاسبات.', imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=8hly31xKli0', price: 400, isFree: false, createdAt: Timestamp.now() }
                      ];
                      try {
                        for (const course of demoCourses) {
                          await addDoc(collection(db, 'courses'), course);
                        }
                        toast.success('تم إضافة الكورسات التجريبية بنجاح');
                        const coursesSnap = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
                        setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
                        playSuccess();
                      } catch (e) {
                        toast.error('خطأ في إضافة الكورسات');
                      }
                    }}
                    className="btn-secondary px-6 py-3"
                  >
                    <span>إضافة كورسات تجريبية</span>
                  </button>
                  <button
                    onClick={() => { playClick(); setShowAddCourse(true); }}
                    onMouseEnter={() => playHover()}
                    className="btn-primary px-6 py-3"
                  >
                    <Plus className="w-5 h-5" />
                    <span>إضافة كورس جديد</span>
                  </button>
                </div>
              </div>

              {showAddCourse && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddCourse}
                  className="mb-12 p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 shadow-inner"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">اسم الكورس</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={newCourse.title}
                        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">التصنيف</label>
                      <select
                        className="input-field"
                        value={newCourse.category}
                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                      >
                        <option value="Programming">Programming</option>
                        <option value="AI">AI</option>
                        <option value="Design">Design</option>
                        <option value="Office">البرامج التطبيقية</option>
                        <option value="University">University</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رابط الصورة</label>
                      <input
                        type="url"
                        required
                        className="input-field"
                        value={newCourse.imageUrl}
                        onChange={e => setNewCourse({ ...newCourse, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رابط YouTube</label>
                      <input
                        type="url"
                        required
                        className="input-field"
                        value={newCourse.videoUrl}
                        onChange={e => setNewCourse({ ...newCourse, videoUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">السعر (EGP)</label>
                      <input
                        type="number"
                        className="input-field"
                        value={newCourse.price}
                        onChange={e => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-end pb-3">
                      <label className="flex items-center gap-3 text-brand-ink cursor-pointer group">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${newCourse.isFree ? 'bg-brand-primary border-brand-primary' : 'border-slate-200 group-hover:border-brand-primary/50'}`}>
                          {newCourse.isFree && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={newCourse.isFree}
                          onChange={e => setNewCourse({ ...newCourse, isFree: e.target.checked })}
                        />
                        <span className="font-black text-sm">كورس مجاني</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">وصف الكورس</label>
                    <textarea
                      required
                      className="input-field h-32 resize-none"
                      value={newCourse.description}
                      onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => { playClick(); setShowAddCourse(false); }} className="px-6 py-3 text-slate-400 hover:text-brand-ink transition-colors font-black uppercase tracking-widest text-xs">إلغاء</button>
                    <button type="submit" className="btn-primary px-10 py-3">حفظ الكورس</button>
                  </div>
                </motion.form>
              )}

              <div className="grid grid-cols-1 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="group flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-200">
                        <img src={course.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="text-brand-ink font-black text-lg group-hover:text-brand-primary transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{CATEGORY_NAMES[course.category] || course.category}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-xs text-slate-500 font-black">{course.isFree ? 'مجاني' : `${course.price} EGP`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteCourse(course.id)} 
                        onMouseEnter={() => playHover()}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'enrollments' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-black text-brand-ink mb-10">طلبات الاشتراك</h2>
              <div className="space-y-4">
                {enrollments.map(enrollment => {
                  const user = users.find(u => u.uid === enrollment.userId);
                  const course = courses.find(c => c.id === enrollment.courseId);
                  return (
                    <div key={enrollment.id} className="p-8 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-xl">
                          {user?.name?.[0] || 'U'}
                        </div>
                        <div className="space-y-1">
                          <p className="text-brand-ink font-black text-lg">{user?.name || 'مستخدم غير معروف'}</p>
                          <p className="text-sm text-brand-accent font-black">كورس: {course?.title || 'كورس محذوف'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{enrollment.createdAt.toDate().toLocaleString('ar-EG')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {enrollment.paymentImage && (
                          <a 
                            href={enrollment.paymentImage} 
                            target="_blank" 
                            rel="noreferrer" 
                            onMouseEnter={() => playHover()}
                            onClick={() => playClick()}
                            className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors font-black text-sm uppercase tracking-widest"
                          >
                            <Eye className="w-4 h-4" />
                            <span>عرض الإيصال</span>
                          </a>
                        )}
                        
                        {enrollment.status === 'pending' ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEnrollmentStatus(enrollment.id, 'approved')}
                              onMouseEnter={() => playHover()}
                              className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all border border-green-100"
                              title="قبول"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEnrollmentStatus(enrollment.id, 'rejected')}
                              onMouseEnter={() => playHover()}
                              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                              title="رفض"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            enrollment.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {enrollment.status === 'approved' ? 'مقبول' : 'مرفوض'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-black text-brand-ink mb-10">إدارة المستخدمين</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-6 text-right">المستخدم</th>
                      <th className="pb-6 text-right">البريد الإلكتروني</th>
                      <th className="pb-6 text-right">الرتبة</th>
                      <th className="pb-6 text-right">تاريخ الانضمام</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-ink">
                    {users.map(user => (
                      <tr key={user.uid} className="border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-brand-primary">
                              {user.name?.[0]}
                            </div>
                            <span className="font-black">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-6 text-slate-500 text-sm font-medium">{user.email}</td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-6 text-slate-400 text-sm font-black">{user.createdAt.toDate().toLocaleDateString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'chatbot' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-brand-ink">إدارة الشات بوت</h2>
                <button
                  onClick={() => { playClick(); setShowAddKnowledge(true); }}
                  onMouseEnter={() => playHover()}
                  className="btn-primary px-6 py-3"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة سؤال جديد</span>
                </button>
              </div>

              {showAddKnowledge && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddKnowledge}
                  className="mb-12 p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 shadow-inner"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">السؤال</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={newKnowledge.question}
                      onChange={e => setNewKnowledge({ ...newKnowledge, question: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الإجابة</label>
                    <textarea
                      required
                      className="input-field h-32 resize-none"
                      value={newKnowledge.answer}
                      onChange={e => setNewKnowledge({ ...newKnowledge, answer: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => { playClick(); setShowAddKnowledge(false); }} className="px-6 py-3 text-slate-400 hover:text-brand-ink transition-colors font-black uppercase tracking-widest text-xs">إلغاء</button>
                    <button type="submit" className="btn-primary px-10 py-3">حفظ</button>
                  </div>
                </motion.form>
              )}

              <div className="space-y-4">
                {chatbotKnowledge.map(k => (
                  <div key={k.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-6 hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300">
                    <div className="space-y-2">
                      <p className="font-black text-brand-ink">{k.question}</p>
                      <p className="text-slate-500 text-sm font-medium">{k.answer}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteKnowledge(k.id)} 
                      onMouseEnter={() => playHover()}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ads' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-brand-ink">إدارة الإعلانات</h2>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      playClick();
                      const demoAds = [
                        { imageUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a5f452?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
                        { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
                        { imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
                        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() },
                        { imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200&h=400', linkUrl: '/courses', createdAt: Timestamp.now() }
                      ];
                      try {
                        for (const ad of demoAds) {
                          await addDoc(collection(db, 'advertisements'), ad);
                        }
                        toast.success('تم إضافة الإعلانات التجريبية بنجاح');
                        // Refresh ads
                        const adsSnap = await getDocs(query(collection(db, 'advertisements'), orderBy('createdAt', 'desc')));
                        setAdvertisements(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement)));
                        playSuccess();
                      } catch (e) {
                        toast.error('خطأ في إضافة الإعلانات');
                      }
                    }}
                    className="btn-secondary px-6 py-3"
                  >
                    <span>إضافة إعلانات تجريبية</span>
                  </button>
                  <button
                    onClick={() => { playClick(); setShowAddAd(true); }}
                    onMouseEnter={() => playHover()}
                    className="btn-primary px-6 py-3"
                  >
                    <Plus className="w-5 h-5" />
                    <span>إضافة إعلان جديد</span>
                  </button>
                </div>
              </div>

              {showAddAd && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddAd}
                  className="mb-12 p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 shadow-inner"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رابط صورة الإعلان</label>
                      <input
                        type="url"
                        required
                        className="input-field"
                        placeholder="https://example.com/ad.png"
                        value={newAd.imageUrl}
                        onChange={e => setNewAd({ ...newAd, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رابط التوجيه (اختياري)</label>
                      <input
                        type="url"
                        className="input-field"
                        placeholder="https://example.com/target"
                        value={newAd.linkUrl}
                        onChange={e => setNewAd({ ...newAd, linkUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => { playClick(); setShowAddAd(false); }} className="px-6 py-3 text-slate-400 hover:text-brand-ink transition-colors font-black uppercase tracking-widest text-xs">إلغاء</button>
                    <button type="submit" className="btn-primary px-10 py-3">حفظ الإعلان</button>
                  </div>
                </motion.form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advertisements.map(ad => (
                  <div key={ad.id} className="glass-card overflow-hidden group">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        {ad.createdAt.toDate().toLocaleDateString('ar-EG')}
                      </p>
                      {ad.linkUrl && (
                        <p className="text-xs text-brand-primary font-medium truncate mt-1">
                          {ad.linkUrl}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-black text-brand-ink mb-10">إعدادات الموقع</h2>
              <form onSubmit={handleUpdateSettings} className="space-y-8">
                <div className="glass-card p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رابط شعار الموقع (Logo URL)</label>
                    <div className="flex gap-4">
                      <input
                        type="url"
                        required
                        className="input-field flex-1"
                        placeholder="https://example.com/logo.png"
                        value={logoUrlInput}
                        onChange={e => setLogoUrlInput(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-8">
                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 p-2">
                      <img 
                        src={logoUrlInput || '/logo.png'} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x400/f8fafc/3b82f6/png?text=Preview';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-brand-ink mb-1">معاينة الشعار</h4>
                      <p className="text-xs text-slate-500 font-medium">هذا هو الشكل الذي سيظهر به الشعار في أعلى الموقع.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رابط صفحة الفيسبوك</label>
                      <input
                        type="url"
                        className="input-field"
                        placeholder="https://facebook.com/yourpage"
                        value={facebookUrlInput}
                        onChange={e => setFacebookUrlInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رقم الواتساب (بالصيغة الدولية)</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="+201099321173"
                        value={whatsappNumberInput}
                        onChange={e => setWhatsappNumberInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary px-12 py-4 flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    <span>حفظ الإعدادات</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
