import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Users, Award, ShieldCheck, Rocket } from 'lucide-react';
import useSound from 'use-sound';

const About: React.FC = () => {
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-brand-dark">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 mb-8 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
            </span>
            <span className="text-xs font-black text-brand-primary tracking-[0.2em] uppercase">قصتنا ورؤيتنا</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-brand-ink mb-8 tracking-tight leading-tight">
            نحن <span className="text-brand-primary">تكنوسوفت</span>، <br />
            رواد التعليم التقني في مصر.
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            تأسست تكنوسوفت بهدف سد الفجوة بين التعليم الأكاديمي ومتطلبات سوق العمل العالمي في مجالات البرمجة والذكاء الاصطناعي.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 space-y-6 group"
          >
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-brand-ink">رسالتنا</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              تمكين الشباب المصري والعربي من خلال تزويدهم بالمهارات التقنية الأكثر طلباً، وتوفير بيئة تعليمية تفاعلية تركز على التطبيق العملي والمشاريع الحقيقية.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 space-y-6 group"
          >
            <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-brand-ink">رؤيتنا</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              أن نصبح المركز الرائد والأكثر ثقة في الشرق الأوسط لتعليم البرمجة والذكاء الاصطناعي، والمساهمة في بناء جيل قادر على المنافسة عالمياً في عصر التحول الرقمي.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-ink mb-4">قيمنا الجوهرية</h2>
            <p className="text-slate-500 font-medium">المبادئ التي تقودنا في كل ما نقوم به.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'الجودة والتميز', desc: 'نقدم محتوى تعليمي عالي الجودة يواكب أحدث التطورات التقنية.', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
              { icon: Users, title: 'التركيز على الطالب', desc: 'نجاح طلابنا هو المقياس الحقيقي لنجاحنا.', color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
              { icon: ShieldCheck, title: 'النزاهة والشفافية', desc: 'نلتزم بالصدق والوضوح في جميع تعاملاتنا.', color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
              { icon: Sparkles, title: 'الابتكار المستمر', desc: 'نبحث دائماً عن طرق جديدة ومبتكرة لتحسين تجربة التعلم.', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => playHover()}
                className="glass-card p-8 text-center group"
              >
                <div className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h4 className="font-black text-brand-ink mb-3">{value.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-16 bg-brand-ink text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/20 blur-[100px]" />
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-black mb-2 text-brand-primary">+5000</div>
              <div className="text-slate-400 font-black uppercase tracking-widest text-[10px]">طالب متخرج</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-brand-accent">+50</div>
              <div className="text-slate-400 font-black uppercase tracking-widest text-[10px]">كورس متخصص</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-brand-secondary">+20</div>
              <div className="text-slate-400 font-black uppercase tracking-widest text-[10px]">خبير تقني</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-brand-primary">98%</div>
              <div className="text-slate-400 font-black uppercase tracking-widest text-[10px]">نسبة رضا الطلاب</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
