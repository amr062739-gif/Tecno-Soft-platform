import { collection, addDoc, Timestamp, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';

const sampleCourses = [
  {
    title: 'دورة البرمجة بلغة Python من الصفر',
    description: 'تعلم أساسيات البرمجة باستخدام لغة بايثون، من المتغيرات إلى البرمجة كائنية التوجه.',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    price: 500,
    isFree: false,
    category: 'programming',
    createdAt: Timestamp.now()
  },
  {
    title: 'مقدمة في الذكاء الاصطناعي',
    description: 'استكشف مفاهيم الذكاء الاصطناعي وتعلم الآلة وكيفية تطبيقها في الحياة العملية.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg',
    price: 0,
    isFree: true,
    category: 'ai',
    createdAt: Timestamp.now()
  },
  {
    title: 'تصميم واجهات المستخدم UI/UX',
    description: 'تعلم مبادئ التصميم وكيفية بناء واجهات مستخدم جذابة وسهلة الاستخدام باستخدام Figma.',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=c9Wg6ndoxag',
    price: 750,
    isFree: false,
    category: 'design',
    createdAt: Timestamp.now()
  },
  {
    title: 'احتراف Microsoft Excel',
    description: 'من المبتدئ إلى المحترف، تعلم كل ما تحتاجه في الإكسيل لإدارة البيانات والتقارير.',
    imageUrl: 'https://images.unsplash.com/photo-1599507591164-c425c374d00c?auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Vl0H-qTclOg',
    price: 300,
    isFree: false,
    category: 'office',
    createdAt: Timestamp.now()
  }
];

export const seedCourses = async () => {
  try {
    const q = query(collection(db, 'courses'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Seeding sample courses...');
      for (const course of sampleCourses) {
        await addDoc(collection(db, 'courses'), course);
      }
      console.log('Seeding completed successfully!');
    } else {
      console.log('Courses already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
};
