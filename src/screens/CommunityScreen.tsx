import { useState } from 'react';
import { Calendar, MessageCircle, MapPin, Users, Heart, Share2, Info, BellRing, Check, ChevronRight, Send } from 'lucide-react';
import type { CommunityEvent, NewsItem } from '@/types';

interface CommunityScreenProps {
    events: CommunityEvent[];
    news: NewsItem[];
}

export function CommunityScreen({ events, news }: CommunityScreenProps) {
    const [activeTab, setActiveTab] = useState<'events' | 'news' | 'chat'>('events');
    const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', author: 'Ахмед', apt: 'кв. 142', text: 'Завтра кто едет в центр утром?', time: '10:15', isMe: false },
        { id: '2', author: 'Елена', apt: 'кв. 89', text: 'У нас опять воду отключили?', time: '11:30', isMe: false },
        { id: '3', author: 'Руслан', apt: 'кв. 12', text: 'Да, вроде авария на линии, обещают к вечеру дать.', time: '11:32', isMe: false },
    ]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now().toString(),
                author: 'Вы',
                apt: 'кв. 55',
                text: newMessage,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            }
        ]);
        setNewMessage('');
    };

    if (activeTab === 'chat') {
        return (
            <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in relative z-20 bg-[#0A0A0F] -m-4 p-4">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setActiveTab('news')}
                        className="w-10 h-10 bg-[#12121A] border border-[#27273A] rounded-xl flex items-center justify-center text-[#F8FAFC]"
                    >
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-[#F8FAFC]">Чат дома</h2>
                        <p className="text-xs text-[#64748B]">Башня 3 • 142 участника</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-20 scrollbar-hide">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-baseline gap-2 mb-1 px-1">
                                <span className="text-xs font-bold text-[#94A3B8]">{msg.author}</span>
                                <span className="text-[10px] text-[#64748B]">{msg.apt}</span>
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[85%] ${msg.isMe
                                ? 'bg-[#3B82F6] text-white rounded-br-none'
                                : 'bg-[#1A1A25] text-[#F8FAFC] border border-[#27273A] rounded-bl-none'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] block mt-1 text-right ${msg.isMe ? 'text-[#BFDBFE]' : 'text-[#64748B]'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Сообщение..."
                        className="flex-1 bg-[#1A1A25] border border-[#27273A] rounded-2xl px-4 py-3.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-[#3B82F6] text-white rounded-2xl flex items-center justify-center disabled:opacity-50 shrink-0 shadow-lg shadow-[#3B82F6]/20"
                    >
                        <Send size={18} className="translate-x-0.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-28 animate-fade-in">
            {/* Header Tabs */}
            <div className="flex bg-[#12121A] rounded-2xl p-1.5 border border-[#27273A]">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'events'
                        ? 'bg-[#1A1A25] text-[#3B82F6] shadow-sm'
                        : 'text-[#64748B] hover:text-[#94A3B8]'
                        }`}
                >
                    События
                </button>
                <button
                    onClick={() => setActiveTab('news')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'news'
                        ? 'bg-[#1A1A25] text-[#3B82F6] shadow-sm'
                        : 'text-[#64748B] hover:text-[#94A3B8]'
                        }`}
                >
                    Коммуникации
                </button>
            </div>

            {activeTab === 'events' ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#F8FAFC]">Мероприятия соседей</h2>

                    {events.map((event) => (
                        <div key={event.id} className="nova-card p-5 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#3B82F6]/10 blur-3xl rounded-full" />

                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${event.type === 'holiday' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                                        event.type === 'activity' ? 'bg-[#10B981]/20 text-[#10B981]' :
                                            'bg-[#3B82F6]/20 text-[#60A5FA]'
                                        }`}>
                                        {event.type === 'holiday' ? 'Праздник' :
                                            event.type === 'activity' ? 'Активность' : 'Встреча'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-8 h-8 rounded-full bg-[#1A1A25] flex items-center justify-center border border-[#27273A] hover:border-[#3B82F6]/50 transition-colors">
                                        <Share2 size={14} className="text-[#64748B]" />
                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-[#1A1A25] flex items-center justify-center border border-[#27273A] hover:border-[#F472B6]/50 transition-colors">
                                        <Heart size={14} className="text-[#64748B]" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-[#F8FAFC] mb-2 relative z-10">{event.title}</h3>
                            <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed relative z-10">{event.description}</p>

                            <div className="space-y-2 mb-4 relative z-10">
                                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                    <Calendar size={14} className="text-[#60A5FA]" />
                                    <span>{new Date(event.date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                    <MapPin size={14} className="text-[#60A5FA]" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                    <Users size={14} className="text-[#60A5FA]" />
                                    <span>Уже идут: {event.participants} соседей</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setJoinedEvents((prev: string[]) =>
                                    prev.includes(event.id)
                                        ? prev.filter((id: string) => id !== event.id)
                                        : [...prev, event.id]
                                )}
                                className={`w-full py-3 rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${joinedEvents.includes(event.id)
                                    ? 'bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30'
                                    : 'bg-[#3B82F6] text-white hover:shadow-lg hover:shadow-[#3B82F6]/25'
                                    }`}
                            >
                                {joinedEvents.includes(event.id) && <Check size={18} />}
                                {joinedEvents.includes(event.id) ? 'Вы участвуете (Готово)' : 'Я пойду'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#F8FAFC]">Новости и объявления</h2>
                        <button className="text-sm text-[#60A5FA] font-medium">+ Написать</button>
                    </div>

                    <div className="grid gap-3">
                        {/* Local Chat Card */}
                        <div
                            onClick={() => setActiveTab('chat')}
                            className="nova-card p-4 hover:border-[#3B82F6]/50 cursor-pointer flex items-center gap-4 transition-all"
                        >
                            <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center shrink-0">
                                <MessageCircle size={24} className="text-[#3B82F6]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-[#F8FAFC]">Чат дома (Башня 3)</h3>
                                <p className="text-sm text-[#64748B]">Ахмед: Завтра кто едет в центр...</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        </div>

                        {/* News List */}
                        {news.map((item) => (
                            <div key={item.id} className="p-4 bg-[#12121A] border border-[#27273A] rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    {item.type === 'news' ? (
                                        <Info size={16} className="text-[#3B82F6]" />
                                    ) : (
                                        <BellRing size={16} className="text-[#F59E0B]" />
                                    )}
                                    <span className="text-xs font-medium text-[#64748B]">{item.author}</span>
                                    <span className="text-xs text-[#64748B] ml-auto">
                                        {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <h3 className="font-bold text-[#F8FAFC] mb-1">{item.title}</h3>
                                <p className="text-sm text-[#94A3B8] leading-relaxed">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
