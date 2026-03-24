import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Lock, CheckCircle } from 'lucide-react';
import { Course } from '../types';
import { motion } from 'motion/react';
import useSound from 'use-sound';
import { CATEGORY_NAMES } from '../constants';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onMouseEnter={() => playHover()}
      className="glass-card overflow-hidden group border-slate-200 hover:border-brand-primary/50 transition-all duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-[10px] font-black text-brand-primary uppercase tracking-wider shadow-sm">
            {CATEGORY_NAMES[course.category] || course.category}
          </span>
          <span className={`px-3 py-1 backdrop-blur-md border rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
            course.isFree 
              ? 'bg-green-500/90 text-white border-green-600' 
              : 'bg-brand-primary/90 text-white border-brand-secondary'
          }`}>
            {course.isFree ? 'مجاني' : `${course.price} EGP`}
          </span>
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-black text-brand-ink mb-3 group-hover:text-brand-primary transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {isEnrolled ? (
            <Link
              to={`/course/${course.id}`}
              onClick={() => playClick()}
              className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors font-black text-sm uppercase tracking-widest"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>مشاهدة الدروس</span>
            </Link>
          ) : (
            <Link
              to={course.isFree ? `/course/${course.id}` : `/payment/${course.id}`}
              onClick={() => playClick()}
              className="w-full btn-primary py-3 text-sm"
            >
              {course.isFree ? <Play className="w-4 h-4 fill-current" /> : <Lock className="w-4 h-4" />}
              <span>{course.isFree ? 'ابدأ التعلم' : 'اشترك الآن'}</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
