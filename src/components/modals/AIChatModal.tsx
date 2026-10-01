import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ExternalLink, Sparkles } from 'lucide-react';
import { ChatMessage, LanguageCode } from '../../types';
import { I18N_DICT } from '../../data/i18n';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAIStudio: () => void;
  currentLang: LanguageCode;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAIStudio,
  currentLang
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your DiDi Marketing AI Agent. Ask me about campaign performance, ROI, or promo code efficiency across Australia and New Zealand.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Analyzing cross-channel metrics for "${query.trim()}" across Australia & New Zealand. Data and charts have been generated successfully with real-time operational grounding!`
        }
      ]);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-xl mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[580px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t.ai_chat_modal_title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.ai_chat_modal_sub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Stream Messages */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-950/40"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start space-x-2'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  AI
                </div>
              )}
              <div
                className={`max-w-md p-3 rounded-2xl text-xs shadow-sm space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white font-medium'
                    : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && idx > 0 && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToAIStudio();
                    }}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-300 font-bold hover:bg-orange-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 text-[11px] cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View in AI Analytic Studio</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                AI
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs shadow-sm flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                <span>Computing real-time marketing metrics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Inquiry Presets */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">
            {t.ai_suggested_inquiries}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSend('Top 5 promo codes in last 5 months')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              ⚡ Top 5 promo codes
            </button>
            <button
              onClick={() => handleSend('Sydney vs Melbourne efficiency comparison')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              🏙️ Sydney vs Melb
            </button>
            <button
              onClick={() => handleSend('Weekend vs Weekday ride usage efficiency')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              📅 Weekend vs Weekday
            </button>
          </div>
        </div>

        {/* User Input Row */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 shrink-0 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder={t.ai_input_ph}
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.ai_send_btn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
