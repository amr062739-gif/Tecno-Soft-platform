import React, { useState, useEffect, useRef } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatbotKnowledge } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import useSound from 'use-sound';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [knowledge, setKnowledge] = useState<ChatbotKnowledge[]>([]);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([
    { role: 'bot', text: 'مرحباً بك في تكنوسوفت! كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.1 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.2 });
  const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', { volume: 0.1 });

  useEffect(() => {
    const fetchKnowledge = async () => {
      const q = query(collection(db, 'chatbot_knowledge'), orderBy('createdAt', 'asc'));
      const snap = await getDocs(q);
      setKnowledge(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatbotKnowledge)));
    };
    fetchKnowledge();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInputValue('');
    playClick();

    // Simple matching logic
    setTimeout(() => {
      const match = knowledge.find(k => 
        text.toLowerCase().includes(k.question.toLowerCase()) || 
        k.question.toLowerCase().includes(text.toLowerCase())
      );

      if (match) {
        setMessages(prev => [...prev, { role: 'bot', text: match.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'عذراً، لم أفهم سؤالك جيداً. يمكنك الاختيار من الأسئلة الشائعة أو التواصل معنا عبر البريد الإلكتروني.' }]);
      }
      playPop();
    }, 600);
  };

  const handleQuestionClick = (q: ChatbotKnowledge) => {
    handleSendMessage(q.question);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm">مساعد تكنوسوفت</h3>
                  <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">متصل الآن</p>
                </div>
              </div>
              <button 
                onClick={() => { playClick(); setIsOpen(false); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                    msg.role === 'bot' 
                      ? 'bg-white text-brand-ink rounded-tl-none border border-slate-100' 
                      : 'bg-brand-primary text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
              
              {/* FAQ Suggestions */}
              {messages.length === 1 && knowledge.length > 0 && (
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">أسئلة شائعة:</p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.slice(0, 4).map(k => (
                      <button
                        key={k.id}
                        onClick={() => handleQuestionClick(k)}
                        onMouseEnter={() => playHover()}
                        className="text-xs bg-white border border-slate-200 text-brand-ink px-4 py-2 rounded-full hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                      >
                        {k.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-brand-primary/20 rounded-xl px-4 py-3 text-sm font-medium"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit"
                className="p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playClick(); setIsOpen(!isOpen); }}
        onMouseEnter={() => playHover()}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-white text-brand-ink border border-slate-100' : 'bg-brand-primary text-white'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
