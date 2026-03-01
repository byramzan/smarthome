import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Calendar, Cloud, Users, Utensils, Moon } from 'lucide-react';
import type { AIMessage } from '@/types';

interface AIAssistantProps {
  messages: AIMessage[];
  onSendMessage: (text: string) => void;
  onActionClick: (action: string) => void;
}

const actionIcons: Record<string, typeof Calendar> = {
  weather: Cloud,
  family: Users,
  ramadan: Moon,
  food: Utensils,
  devices: Sparkles,
  default: Sparkles
};

export function AIAssistant({ messages, onSendMessage, onActionClick }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    onSendMessage(inputText);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleActionClickLocal = (action: string) => {
    onActionClick(action);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-28 right-5 w-14 h-14 rounded-2xl flex items-center justify-center z-50 transition-all duration-500 ${
          isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)'
        }}
      >
        <Bot size={26} className="text-white" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-28 right-5 left-5 max-w-[440px] mx-auto rounded-3xl z-50 overflow-hidden transition-all duration-500 ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(180deg, #12121A 0%, #0A0A0F 100%)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          boxShadow: '0 8px 48px rgba(0, 0, 0, 0.6), 0 0 32px rgba(124, 58, 237, 0.15)',
          maxHeight: isOpen ? '70vh' : '0'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(167, 139, 250, 0.1) 100%)',
            borderBottom: '1px solid rgba(124, 58, 237, 0.2)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)'
              }}
            >
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">NOVA Ассистент</h3>
              <p className="text-[#60A5FA] text-xs">AI-powered помощник</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[320px] overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'chat-user text-white rounded-br-md'
                    : 'chat-ai text-[#F8FAFC] rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-[#64748B]'}`}>
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-ai px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-typing" />
                  <span className="w-2 h-2 bg-[#60A5FA] rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          {messages[messages.length - 1]?.actions && messages[messages.length - 1].sender === 'ai' && (
            <div className="flex flex-wrap gap-2 mt-2 animate-fade-in">
              {messages[messages.length - 1].actions!.map((action) => {
                const Icon = actionIcons[action.action] || actionIcons.default;
                return (
                  <button
                    key={action.action}
                    onClick={() => handleActionClickLocal(action.action)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1A1A25] border border-[#3B82F6]/30 rounded-xl text-xs font-medium text-[#60A5FA] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/50 transition-all"
                  >
                    <Icon size={12} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#27273A] bg-[#0A0A0F]">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напишите сообщение..."
              className="flex-1 px-4 py-3 bg-[#1A1A25] border border-[#27273A] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                background: inputText.trim() 
                  ? 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' 
                  : '#27273A',
                boxShadow: inputText.trim() ? '0 4px 16px rgba(124, 58, 237, 0.4)' : 'none'
              }}
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
