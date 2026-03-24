import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Enrollment } from '../types';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../AuthContext';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'motion/react';
import useSound from 'use-sound';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { user } = useAuth();
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'Programming', name: 'البرمجة' },
    { id: 'AI', name: 'الذكاء الاصطناعي' },
    { id: 'Design', name: 'التصميم' },
    { id: 'Office', name: 'البرامج التطبيقية' },
    { id: 'University', name: 'المواد الجامعية المتخصصة' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      
      if (coursesData.length === 0) {
        setCourses([
          { id: 'demo-p1', title: 'أساسيات البرمجة بلغة Python', category: 'Programming', description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة بايثون.', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', price: 0, isFree: true, createdAt: Timestamp.now() },
          { id: 'demo-a1', title: 'مقدمة في الذكاء الاصطناعي', category: 'AI', description: 'استكشف عالم الذكاء الاصطناعي وتعلم المفاهيم الأساسية.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', price: 500, isFree: false, createdAt: Timestamp.now() },
          { id: 'demo-d1', title: 'تصميم واجهات المستخدم UI/UX', category: 'Design', description: 'تعلم كيفية تصميم واجهات مستخدم جذابة وسهلة الاستخدام.', imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=c9Wg6ndoxag', price: 300, isFree: false, createdAt: Timestamp.now() },
          { id: 'demo-o1', title: 'احتراف Microsoft Excel', category: 'Office', description: 'اتقن استخدام برنامج إكسيل من الجداول البسيطة إلى المعادلات المعقدة.', imageUrl: 'https://images.unsplash.com/photo-1591696208162-a97b7417444c?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', price: 150, isFree: false, createdAt: Timestamp.now() },
          { id: 'demo-u1', title: 'هياكل البيانات والخوارزميات (جامعي)', category: 'University', description: 'شرح مفصل لمادة هياكل البيانات والخوارزميات لطلاب كليات الحاسبات.', imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=8hly31xKli0', price: 400, isFree: false, createdAt: Timestamp.now() }
        ]);
      } else {
        setCourses(coursesData);
      }

      if (user) {
        const enrollmentsQuery = query(
          collection(db, 'enrollments'),
          where('userId', '==', user.uid),
          where('status', '==', 'approved')
        );
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
        const enrolledIds = new Set(enrollmentsSnapshot.docs.map(doc => (doc.data() as Enrollment).courseId));
        setEnrolledCourseIds(enrolledIds);
      }
    };
    fetchData();
  }, [user]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'free' && course.isFree) || 
      (filter === 'paid' && !course.isFree);
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto bg-brand-dark">
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-brand-ink mb-6 tracking-tight">
            استكشف <span className="text-brand-primary">مكتبة</span> الكورسات
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            اختر من بين مجموعة واسعة من الكورسات التعليمية في مختلف المجالات التقنية والإبداعية.
          </p>
        </motion.div>
        
        <div className="glass-card p-10 space-y-10">
          {/* Search and Price Filter */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن كورس..."
                className="input-field pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl p-1.5">
              {['all', 'free', 'paid'].map((f) => (
                <button
                  key={f}
                  onClick={() => { playClick(); setFilter(f as any); }}
                  onMouseEnter={() => playHover()}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${filter === f ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:text-brand-primary'}`}
                >
                  {f === 'all' ? 'الكل' : f === 'free' ? 'مجاني' : 'مدفوع'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-8 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-3 text-brand-primary flex-shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">التصنيفات</span>
            </div>
            <div className="flex gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { playClick(); setCategoryFilter(cat.id); }}
                  onMouseEnter={() => playHover()}
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 whitespace-nowrap ${
                    categoryFilter === cat.id 
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                      : 'border-slate-200 text-slate-400 hover:border-brand-primary/50 hover:text-brand-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isEnrolled={enrolledCourseIds.has(course.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass-card">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-500 text-xl font-black mb-4">لم يتم العثور على كورسات تطابق بحثك.</p>
          <button 
            onClick={() => { playClick(); setSearchTerm(''); setFilter('all'); setCategoryFilter('all'); }}
            onMouseEnter={() => playHover()}
            className="text-brand-primary hover:text-brand-secondary transition-colors font-black uppercase tracking-widest text-sm flex items-center gap-2 mx-auto"
          >
            <X className="w-4 h-4" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
