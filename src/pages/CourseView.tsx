import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Enrollment } from '../types';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { Play, List, Info, AlertCircle } from 'lucide-react';
import useSound from 'use-sound';

const CourseView: React.FC = () => {
  const { courseId } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  useEffect(() => {
    const checkAccess = async () => {
      if (!courseId || !user) {
        if (!user) navigate('/auth');
        return;
      }

      // Fetch course
      const courseSnap = await getDoc(doc(db, 'courses', courseId));
      if (!courseSnap.exists()) {
        setLoading(false);
        return;
      }
      const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
      setCourse(courseData);

      // Check access
      if (courseData.isFree || isAdmin) {
        setIsAuthorized(true);
      } else {
        const q = query(
          collection(db, 'enrollments'),
          where('userId', '==', user.uid),
          where('courseId', '==', courseId),
          where('status', '==', 'approved')
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsAuthorized(true);
        } else {
          navigate(`/payment/${courseId}`);
        }
      }
      setLoading(false);
    };
    checkAccess();
  }, [courseId, user, isAdmin, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-ink bg-brand-dark">جاري التحقق من الصلاحيات...</div>;
  if (!course || !isAuthorized) return null;

  // Extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(course.videoUrl);

  return (
    <div className="min-h-screen pt-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-brand-primary/10 relative">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50">
                <AlertCircle className="w-12 h-12 opacity-20" />
                <p className="font-black text-sm uppercase tracking-widest">رابط الفيديو غير صالح</p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-brand-ink mb-6 tracking-tight leading-tight">{course.title}</h1>
              <div className="flex items-center gap-6">
                <span className="px-5 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                  {course.category || 'عام'}
                </span>
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">تم النشر في {course.createdAt.toDate().toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
            
            <div className="glass-card p-10">
              <h3 className="text-xl font-black text-brand-ink mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Info className="w-5 h-5" />
                </div>
                <span>وصف الكورس</span>
              </h3>
              <p className="text-slate-500 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar / Playlist */}
        <div className="space-y-8">
          <div className="glass-card overflow-hidden sticky top-32 shadow-xl shadow-brand-primary/5">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-brand-ink font-black flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <List className="w-5 h-5" />
                </div>
                <span className="text-xl">محتوى الكورس</span>
              </h3>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
              {[1, 2, 3, 4, 5].map((lesson) => (
                <div
                  key={lesson}
                  onMouseEnter={() => playHover()}
                  onClick={() => playClick()}
                  className={`p-6 flex items-center gap-5 border-b border-slate-50 transition-all duration-300 cursor-pointer group ${lesson === 1 ? 'bg-brand-primary/5' : 'hover:bg-slate-50'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-sm transition-all duration-300 ${lesson === 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'}`}>
                    {lesson === 1 ? <Play className="w-5 h-5 fill-current" /> : lesson}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-black transition-colors duration-300 ${lesson === 1 ? 'text-brand-primary' : 'text-slate-500 group-hover:text-brand-ink'}`}>الدرس رقم {lesson}: مقدمة وتعريف</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">15:00 دقيقة</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
