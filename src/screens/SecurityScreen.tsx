import { QrCode, Plus, Clock, Shield, History, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import type { GuestQR, SecurityIncident } from '@/types';

interface SecurityScreenProps {
  guestQRs: GuestQR[];
  onGenerateQR: (purpose: string, hours: number) => GuestQR;
  onDeleteQR: (id: string) => void;
  incidents: SecurityIncident[];
}

export function SecurityScreen({ guestQRs, onGenerateQR, onDeleteQR, incidents }: SecurityScreenProps) {
  const [activeTab, setActiveTab] = useState<'access' | 'cameras'>('access');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState<GuestQR | null>(null);
  const [purpose, setPurpose] = useState('');
  const [hours, setHours] = useState(6);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!purpose.trim()) return;
    const newQR = onGenerateQR(purpose, hours);
    setShowGenerateModal(false);
    setShowQRModal(newQR);
    setPurpose('');
    setHours(6);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-5 pb-28 animate-fade-in">
      {/* Header Tabs */}
      <div className="flex bg-[#12121A] rounded-2xl p-1.5 border border-[#27273A]">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'access'
            ? 'bg-[#1A1A25] text-[#3B82F6] shadow-sm'
            : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
        >
          Доступ и ключи
        </button>
        <button
          onClick={() => setActiveTab('cameras')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'cameras'
            ? 'bg-[#1A1A25] text-[#3B82F6] shadow-sm'
            : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
        >
          AI Камеры
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        </button>
      </div>

      {activeTab === 'access' ? (
        <>
          {/* My QR Code */}
          <div className="nova-card p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#3B82F6]/20 blur-3xl rounded-full" />

            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
                  <QrCode size={22} className="text-[#60A5FA]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F8FAFC]">Мой пропуск</h3>
                  <p className="text-xs text-[#64748B]">Действует постоянно</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
                <Shield size={14} className="text-[#10B981]" />
                <span className="text-xs font-bold text-[#10B981]">Активен</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className="w-48 h-48 rounded-3xl p-4 mb-4 bg-white flex items-center justify-center flex-shrink-0"
                style={{
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
                }}
              >
                <QRCode value="NOVA-USER-PASS-12345" size={160} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
              </div>
              <p className="text-sm text-[#64748B] text-center">
                Покажите QR-код на входе<br />в ЖК и подъезд
              </p>
            </div>
          </div>

          {/* Guest Access */}
          <div className="nova-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">Гостевой доступ</h3>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-bold"
              >
                <Plus size={16} />
                Создать
              </button>
            </div>

            {guestQRs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#1A1A25] rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode size={24} className="text-[#64748B]" />
                </div>
                <p className="text-sm text-[#94A3B8]">Нет активных гостевых пропусков</p>
                <p className="text-xs text-[#64748B] mt-1">Создайте QR-код для гостей или курьеров</p>
              </div>
            ) : (
              <div className="space-y-3">
                {guestQRs.map((qr) => (
                  <div
                    key={qr.id}
                    onClick={() => setShowQRModal(qr)}
                    className="flex items-center justify-between p-3.5 bg-[#1A1A25] rounded-xl border border-[#27273A] cursor-pointer hover:border-[#3B82F6]/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
                        <QrCode size={18} className="text-[#60A5FA]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F8FAFC]">{qr.purpose}</p>
                        <div className="flex items-center gap-1 text-xs text-[#64748B]">
                          <Clock size={12} />
                          до {formatExpiry(qr.expiresAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#12121A] rounded-xl flex items-center justify-center border border-[#27273A]">
                        <span className="text-xs font-mono text-[#94A3B8]">{qr.code.slice(-4)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteQR(qr.id);
                        }}
                        className="w-10 h-10 bg-[#EF4444]/10 rounded-xl flex items-center justify-center border border-[#EF4444]/30 hover:bg-[#EF4444]/20 transition-colors"
                      >
                        <X size={16} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Access History */}
          <div className="nova-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">История доступа</h3>
              <button className="text-sm text-[#60A5FA] font-medium">Вся история</button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                    <History size={16} className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Вход в подъезд</p>
                    <p className="text-xs text-[#64748B]">Сегодня, 08:30</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#10B981]">Успешно</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                    <History size={16} className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Вход на территорию ЖК</p>
                    <p className="text-xs text-[#64748B]">Сегодня, 08:28</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#10B981]">Успешно</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#64748B]/10 rounded-xl flex items-center justify-center">
                    <History size={16} className="text-[#64748B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Выход из подъезда</p>
                    <p className="text-xs text-[#64748B]">Вчера, 19:45</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#64748B]">Выход</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F8FAFC]">Сводка событий (Нейросеть)</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
              В сети (42 камеры)
            </div>
          </div>
          <div className="grid gap-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="nova-card p-4 relative overflow-hidden">
                {incident.status === 'active' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/10 blur-3xl rounded-full" />
                )}
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${incident.status === 'active' ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50' : 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50'}`}>
                      {incident.status === 'active' ? 'Требует внимания' : 'Решено охраной'}
                    </span>
                  </div>
                  <span className="text-xs text-[#64748B]">
                    {new Date(incident.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="font-bold text-[#F8FAFC] mb-1 relative z-10 text-sm">{incident.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed relative z-10 mb-3">{incident.description}</p>
                {incident.status === 'active' && (
                  <button className="w-full py-2.5 bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 rounded-xl font-bold hover:bg-[#EF4444]/20 transition-all text-sm mt-1">
                    Вызвать ГБР / Полицию
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate QR Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#12121A] border border-[#27273A] rounded-3xl p-6 mx-4 max-w-sm w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#F8FAFC]">Гостевой доступ</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="w-9 h-9 bg-[#1A1A25] rounded-xl flex items-center justify-center text-[#64748B]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-[#94A3B8] mb-4">
              Укажите время работы и для кого он предназначен.
            </p>

            <div className="flex gap-2 mb-4">
              {[1, 6, 24].map(h => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${hours === h
                      ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6]'
                      : 'bg-[#1A1A25] border-[#27273A] text-[#64748B] hover:border-[#3B82F6]/50'
                    }`}
                >
                  {h} {h === 1 ? 'час' : h === 24 ? 'часа' : 'часов'}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Например: Курьер Wildberries"
              className="w-full px-4 py-3.5 bg-[#1A1A25] border border-[#27273A] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none transition-colors mb-4"
            />

            <button
              onClick={handleGenerate}
              disabled={!purpose.trim()}
              className="w-full py-3.5 bg-[#3B82F6] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Создать QR-код
            </button>
          </div>
        </div>
      )}

      {/* View QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#12121A] border border-[#27273A] rounded-3xl p-6 mx-4 max-w-sm w-full text-center">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#F8FAFC]">{showQRModal.purpose}</h3>
              <button
                onClick={() => setShowQRModal(null)}
                className="w-9 h-9 bg-[#1A1A25] rounded-xl flex items-center justify-center text-[#64748B]"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="w-48 h-48 rounded-3xl p-4 mx-auto mb-5 bg-white flex items-center justify-center flex-shrink-0"
              style={{
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <QRCode value={showQRModal.code} size={160} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <code className="px-4 py-2 bg-[#1A1A25] rounded-xl text-sm font-mono text-[#94A3B8]">
                {showQRModal.code}
              </code>
              <button
                onClick={() => copyCode(showQRModal.code)}
                className="w-10 h-10 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center hover:bg-[#3B82F6]/20 transition-colors"
              >
                {copied ? <Check size={18} className="text-[#10B981]" /> : <Copy size={18} className="text-[#60A5FA]" />}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-[#64748B]">
              <Clock size={14} />
              <span>Действует до {formatExpiry(showQRModal.expiresAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
