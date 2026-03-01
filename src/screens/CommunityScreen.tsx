import { useState } from 'react';
import { Calendar, MessageCircle, MapPin, Users, Heart, Share2, Info, BellRing, Check } from 'lucide-react';
import type { CommunityEvent, NewsItem } from '@/types';

interface CommunityScreenProps {
    events: CommunityEvent[];
    news: NewsItem[];
}

export function CommunityScreen({ events, news }: CommunityScreenProps) {
    const [activeTab, setActiveTab] = useState<'events' | 'news'>('events');
    const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

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
                                onClick={() => setJoinedEvents(prev =>
                                    prev.includes(event.id)
                                        ? prev.filter(id => id !== event.id)
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
                        <div className="nova-card p-4 hover:border-[#3B82F6]/50 cursor-pointer flex items-center gap-4 transition-all">
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
