import React from 'react';
import { motion } from 'motion/react';
import { Globe, Smartphone, Code, Layout, Database, Server, Cpu, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import useSound from 'use-sound';

const Software: React.FC = () => {
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });

  const services = [
    {
      icon: Globe,
      title: 'تطوير مواقع الويب',
      desc: 'نصمم ونطور مواقع ويب عصرية، سريعة، ومتوافقة مع جميع الأجهزة باستخدام أحدث التقنيات مثل React و Next.js.',
      tags: ['Frontend', 'Backend', 'Fullstack'],
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10'
    },
    {
      icon: Smartphone,
      title: 'تطبيقات الهاتف المحمول',
      desc: 'بناء تطبيقات هواتف ذكية قوية وسلسة لنظامي Android و iOS باستخدام تقنيات Flutter و React Native.',
      tags: ['Android', 'iOS', 'Cross-platform'],
      color: 'text-brand-accent',
      bg: 'bg-brand-accent/10'
    },
    {
      icon: Database,
      title: 'أنظمة إدارة البيانات',
      desc: 'تصميم قواعد بيانات معقدة وأنظمة إدارة معلومات مخصصة تلبي احتياجات الشركات والمؤسسات الكبيرة.',
      tags: ['SQL', 'NoSQL', 'Big Data'],
      color: 'text-brand-secondary',
      bg: 'bg-brand-secondary/10'
    },
    {
      icon: Cpu,
      title: 'حلول الذكاء الاصطناعي',
      desc: 'دمج تقنيات الذكاء الاصطناعي وتعلم الآلة في برامجك لأتمتة العمليات وتحسين اتخاذ القرار.',
      tags: ['AI', 'ML', 'Automation'],
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10'
    }
  ];

  const projects = [
    {
      title: 'منصة تكنوسوفت التعليمية',
      category: 'Web Application',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
      desc: 'نظام إدارة تعلم متكامل يخدم آلاف الطلاب يومياً.'
    },
    {
      title: 'تطبيق إدارة المبيعات الذكي',
      category: 'Mobile App',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      desc: 'تطبيق للهواتف يساعد الشركات على تتبع مبيعاتها في الوقت الفعلي.'
    },
    {
      title: 'نظام أتمتة المستودعات',
      category: 'Enterprise Software',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
      desc: 'برنامج مخصص لإدارة المخزون والعمليات اللوجستية بكفاءة عالية.'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-brand-dark">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8 shadow-sm">
            <Zap className="w-4 h-4 text-brand-primary animate-pulse" />
            <span className="text-xs font-black text-brand-primary tracking-[0.2em] uppercase">نحول أفكارك إلى واقع رقمي</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-brand-ink mb-8 tracking-tight leading-tight">
            البرامج ومواقع <span className="text-brand-primary">الويب</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            نقدم حلولاً برمجية متكاملة ومواقع ويب احترافية مصممة خصيصاً لتلبية احتياجاتك وتطوير أعمالك في العالم الرقمي.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onMouseEnter={() => playHover()}
              className="glass-card p-12 flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-500"
            >
              <div>
                <div className={`w-16 h-16 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-brand-ink mb-4">{service.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">{service.desc}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {service.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mb-32 text-center">
          <h2 className="text-4xl font-black text-brand-ink mb-16">تقنياتنا المفضلة</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex flex-col items-center gap-4">
              <Code className="w-12 h-12" />
              <span className="font-black text-xs uppercase tracking-widest">React</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Layout className="w-12 h-12" />
              <span className="font-black text-xs uppercase tracking-widest">Tailwind</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Server className="w-12 h-12" />
              <span className="font-black text-xs uppercase tracking-widest">Node.js</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Database className="w-12 h-12" />
              <span className="font-black text-xs uppercase tracking-widest">PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-black text-brand-ink mb-4">أعمالنا المميزة</h2>
              <p className="text-slate-500 font-medium">نظرة سريعة على بعض المشاريع التي قمنا بتنفيذها بنجاح.</p>
            </div>
            <button
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
              className="btn-secondary py-4 px-10 text-sm flex items-center gap-3"
            >
              <span>مشاهدة جميع الأعمال</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-lg"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">{project.category}</span>
                  <h4 className="text-xl font-black text-brand-ink mb-3 group-hover:text-brand-primary transition-colors">{project.title}</h4>
                  <p className="text-slate-500 text-sm font-medium mb-6">{project.desc}</p>
                  <button className="flex items-center gap-2 text-brand-ink font-black text-xs uppercase tracking-widest hover:text-brand-primary transition-colors">
                    <span>عرض التفاصيل</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-16 text-center bg-brand-primary/5 border-brand-primary/20">
          <h2 className="text-4xl font-black text-brand-ink mb-6">هل لديك مشروع في ذهنك؟</h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto font-medium">
            دعنا نناقش فكرتك ونحولها إلى منتج رقمي ناجح. فريقنا جاهز لبدء العمل معك.
          </p>
          <button
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="btn-primary py-5 px-12 text-lg"
          >
            اطلب استشارة مجانية
          </button>
        </div>
      </div>
    </div>
  );
};

export default Software;
