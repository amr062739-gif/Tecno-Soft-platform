import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Course, Enrollment } from '../types';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import useSound from 'use-sound';

const Payment: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [existingEnrollment, setExistingEnrollment] = useState<Enrollment | null>(null);
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', { volume: 0.2 });

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !user) return;

      // Fetch course
      const courseSnap = await getDoc(doc(db, 'courses', courseId));
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
      }

      // Check for existing enrollment
      const q = query(
        collection(db, 'enrollments'),
        where('userId', '==', user.uid),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setExistingEnrollment({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Enrollment);
      }
      setLoading(false);
    };
    fetchData();
  }, [courseId, user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      playClick();
    }
  };

  const handleSubmit = async () => {
    if (!file || !user || !course) return;
    playClick();

    setUploading(true);
    try {
      // Upload screenshot
      const storageRef = ref(storage, `payments/${user.uid}_${course.id}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Create enrollment request
      await addDoc(collection(db, 'enrollments'), {
        userId: user.uid,
        courseId: course.id,
        status: 'pending',
        paymentMethod: 'Vodafone Cash / Instapay',
        paymentImage: downloadURL,
        createdAt: Timestamp.now(),
      });

      playSuccess();
      toast.success('تم إرسال طلب الاشتراك بنجاح. سيتم مراجعته قريباً.');
      navigate('/courses');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-ink bg-brand-dark">جاري التحميل...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center text-brand-ink bg-brand-dark">الكورس غير موجود</div>;

  if (existingEnrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark">
        <div className="glass-card p-10 text-center max-w-md shadow-2xl shadow-brand-primary/10">
          {existingEnrollment.status === 'pending' ? (
            <>
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-brand-ink mb-3">طلبك قيد المراجعة</h2>
              <p className="text-slate-500 font-medium mb-8">لقد قمت بإرسال طلب اشتراك بالفعل. سيتم تفعيل الكورس فور مراجعة التحويل.</p>
            </>
          ) : existingEnrollment.status === 'approved' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-brand-ink mb-3">أنت مشترك بالفعل</h2>
              <p className="text-slate-500 font-medium mb-8">يمكنك البدء في مشاهدة الكورس الآن.</p>
              <button 
                onClick={() => { playClick(); navigate(`/course/${course.id}`); }} 
                onMouseEnter={() => playHover()}
                className="btn-primary px-8 py-3"
              >
                مشاهدة الكورس
              </button>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-brand-ink mb-3">تم رفض الطلب</h2>
              <p className="text-slate-500 font-medium mb-8">يرجى التواصل مع الدعم الفني لمزيد من التفاصيل.</p>
            </>
          )}
          <button 
            onClick={() => { playClick(); navigate('/courses'); }} 
            onMouseEnter={() => playHover()}
            className="mt-6 text-brand-primary hover:text-brand-secondary transition-colors font-black uppercase tracking-widest text-xs"
          >
            العودة للكورسات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto bg-brand-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden shadow-2xl shadow-brand-primary/10"
      >
        <div className="p-10 border-b border-slate-100 bg-gradient-to-r from-brand-primary/5 to-transparent">
          <h1 className="text-4xl font-black text-brand-ink mb-3 tracking-tight">الاشتراك في كورس: {course.title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-black uppercase tracking-widest text-xs">المبلغ المطلوب:</span>
            <span className="text-brand-accent font-black text-3xl">{course.price} EGP</span>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Instructions */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-brand-ink">تعليمات الدفع</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-accent font-black group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  1
                </div>
                <div>
                  <p className="text-brand-ink font-black text-lg mb-3">اختر وسيلة الدفع</p>
                  <div className="flex gap-3">
                    <span className="px-4 py-1.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full text-[10px] font-black uppercase tracking-widest">Vodafone Cash</span>
                    <span className="px-4 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest">Instapay</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-accent font-black group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  2
                </div>
                <div>
                  <p className="text-brand-ink font-black text-lg mb-2">قم بالتحويل للرقم التالي</p>
                  <p className="text-3xl font-black text-brand-primary tracking-tighter">01012345678</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">باسم: أكاديمية تكنوسوفت</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-accent font-black group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  3
                </div>
                <div>
                  <p className="text-brand-ink font-black text-lg mb-2">ارفع صورة التحويل</p>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">قم بأخذ لقطة شاشة (Screenshot) لعملية التحويل الناجحة وارفاقها هنا للمراجعة.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex flex-col justify-center">
            <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-500 ${file ? 'border-green-500 bg-green-50/30' : 'border-slate-200 hover:border-brand-primary bg-slate-50/50'}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {file ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-brand-ink font-black text-lg">{file.name}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); playClick(); }} 
                    className="text-xs text-red-500 hover:text-red-700 transition-colors font-black uppercase tracking-widest"
                  >
                    تغيير الصورة
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                    <Upload className="w-10 h-10 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-brand-ink font-black text-xl mb-2">اضغط لرفع صورة التحويل</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              onMouseEnter={() => playHover()}
              className="mt-10 w-full btn-primary py-5 text-lg"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>تأكيد الاشتراك وإرسال الطلب</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
