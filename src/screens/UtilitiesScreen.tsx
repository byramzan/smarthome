import { Receipt, Zap, Droplets, Home, CreditCard, CheckCircle, AlertCircle, ChevronRight, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import type { Payment, Notification, UtilityStats } from '@/types';

interface UtilitiesScreenProps {
  payments: Payment[];
  utilityStats: UtilityStats[];
  notifications: Notification[];
  totalPending: number;
  onMarkRead: (id: string) => void;
}

const paymentTypeLabels: Record<string, string> = {
  electricity: 'Электроэнергия',
  water: 'Водоснабжение',
  gas: 'Газ',
  maintenance: 'Обслуживание',
  rent: 'Аренда квартиры'
};

const paymentTypeIcons: Record<string, typeof Zap> = {
  electricity: Zap,
  water: Droplets,
  gas: Home,
  maintenance: Home,
  rent: Home
};

const paymentTypeColors: Record<string, string> = {
  electricity: '#F59E0B',
  water: '#3B82F6',
  gas: '#10B981',
  maintenance: '#64748B',
  rent: '#3B82F6'
};

export function UtilitiesScreen({ payments, utilityStats, notifications, totalPending, onMarkRead }: UtilitiesScreenProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rentMonths, setRentMonths] = useState(1);
  const [showRentModal, setShowRentModal] = useState(false);

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const paidPayments = payments.filter(p => p.status === 'paid').slice(0, 3);

  const handlePay = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setSelectedPayment(null);
    }, 2000);
  };

  const handleRentPay = () => {
    setShowRentModal(true);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const [selectedMonth, setSelectedMonth] = useState<UtilityStats | null>(null);

  // Stats
  const totalElectricity = utilityStats.reduce((sum, s) => sum + s.electricity, 0);
  const totalWater = utilityStats.reduce((sum, s) => sum + s.water, 0);
  const totalGas = utilityStats.reduce((sum, s) => sum + s.gas, 0);
  const avgMonthly = Math.round((totalElectricity + totalWater + totalGas) / utilityStats.length);

  return (
    <div className="space-y-5 pb-28 animate-fade-in">
      {/* Balance Card */}
      <div
        className="p-6 rounded-3xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)'
        }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

        <p className="text-sm text-white/80 mb-1 relative z-10">Сумма к оплате</p>
        <h2 className="text-4xl font-bold text-white mb-5 relative z-10">{totalPending.toLocaleString('ru-RU')} ₽</h2>

        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => pendingPayments.length > 0 && handlePay(pendingPayments[0])}
            className="flex-1 py-3.5 bg-white text-[#3B82F6] rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Оплатить всё
          </button>
          <button
            onClick={handleRentPay}
            className="px-5 py-3.5 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all"
          >
            Аренда
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="nova-card p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-nova-primary/20 blur-3xl rounded-full" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[#60A5FA]" />
            <h3 className="font-bold text-base text-[#F8FAFC]">Статистика расходов</h3>
          </div>
          <span className="text-xs text-[#64748B]">6 месяцев</span>
        </div>

        {/* Chart */}
        <div className="mb-4 relative z-10">
          <div className="flex items-end justify-between h-28 gap-2">
            {utilityStats.map((stat, index) => {
              const maxTotal = Math.max(...utilityStats.map(s => s.electricity + s.water + s.gas));

              return (
                <div
                  key={index}
                  className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-all hover:opacity-80 ${selectedMonth && selectedMonth.month !== stat.month ? 'opacity-40' : 'opacity-100'
                    }`}
                  onClick={() => setSelectedMonth(selectedMonth?.month === stat.month ? null : stat)}
                >
                  <div className="w-full flex items-end gap-0.5" style={{ height: '90px' }}>
                    <div
                      className="flex-1 bg-[#F59E0B] rounded-t"
                      style={{ height: `${(stat.electricity / maxTotal) * 100}%` }}
                    />
                    <div
                      className="flex-1 bg-[#3B82F6] rounded-t"
                      style={{ height: `${(stat.water / maxTotal) * 100}%` }}
                    />
                    <div
                      className="flex-1 bg-[#10B981] rounded-t"
                      style={{ height: `${(stat.gas / maxTotal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#64748B]">{stat.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#F59E0B] rounded" />
              <span className="text-xs text-[#64748B]">Свет</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#3B82F6] rounded" />
              <span className="text-xs text-[#64748B]">Вода</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#10B981] rounded" />
              <span className="text-xs text-[#64748B]">Газ</span>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#27273A] relative z-10 transition-all">
          <div className="text-center">
            <p className="text-xs text-[#64748B] mb-1">
              {selectedMonth ? 'Расход за период' : 'Средний расход'}
            </p>
            <p className="text-lg font-bold text-[#60A5FA]">
              {selectedMonth
                ? (selectedMonth.electricity + selectedMonth.water + selectedMonth.gas).toLocaleString('ru-RU')
                : avgMonthly.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#64748B] mb-1">Электричество</p>
            <p className="text-lg font-bold text-[#F59E0B]">
              {selectedMonth ? selectedMonth.electricity.toLocaleString('ru-RU') : totalElectricity.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#64748B] mb-1">Вода</p>
            <p className="text-lg font-bold text-[#3B82F6]">
              {selectedMonth ? selectedMonth.water.toLocaleString('ru-RU') : totalWater.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="nova-card p-5">
          <h3 className="font-bold text-base text-[#F8FAFC] mb-4">Текущие начисления</h3>
          <div className="space-y-3">
            {pendingPayments.map((payment) => {
              const Icon = paymentTypeIcons[payment.type] || Receipt;
              const color = paymentTypeColors[payment.type];

              return (
                <div key={payment.id} className="flex items-center justify-between p-3.5 bg-[#1A1A25] rounded-xl border border-[#27273A]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{paymentTypeLabels[payment.type]}</p>
                      <p className="text-xs text-[#64748B]">{payment.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#F8FAFC]">{payment.amount.toLocaleString('ru-RU')} ₽</span>
                    <button
                      onClick={() => handlePay(payment)}
                      className="px-3 py-1.5 bg-nova-primary text-white rounded-lg text-xs font-bold"
                    >
                      Оплатить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="nova-card p-5">
          <h3 className="font-bold text-base text-[#F8FAFC] mb-4">Уведомления</h3>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border ${notification.type === 'emergency'
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                    : notification.type === 'warning'
                      ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30'
                      : 'bg-[#3B82F6]/10 border-[#3B82F6]/30'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.type === 'emergency'
                      ? 'bg-[#EF4444]'
                      : notification.type === 'warning'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#3B82F6]'
                    }`}>
                    <AlertCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${notification.type === 'emergency'
                        ? 'text-[#EF4444]'
                        : notification.type === 'warning'
                          ? 'text-[#F59E0B]'
                          : 'text-[#3B82F6]'
                      }`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] mt-1">{notification.message}</p>
                    {notification.action && (
                      <button
                        onClick={notification.action.handler}
                        className="mt-2 px-4 py-2 bg-nova-primary text-white rounded-lg text-xs font-bold"
                      >
                        {notification.action.label}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="text-[#64748B] hover:text-[#94A3B8]"
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="nova-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[#F8FAFC]">История платежей</h3>
          <button className="text-sm text-[#60A5FA] font-medium flex items-center gap-1">
            Все
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {paidPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-2 border-b border-[#27273A] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle size={14} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F8FAFC]">{paymentTypeLabels[payment.type]}</p>
                  <p className="text-xs text-[#64748B]">{payment.period}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#10B981]">-{payment.amount.toLocaleString('ru-RU')} ₽</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Success Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#12121A] border border-[#10B981]/30 rounded-3xl p-6 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} className="text-[#10B981]" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Оплата успешна!</h3>
            <p className="text-sm text-[#64748B] mb-1">
              {selectedPayment ? paymentTypeLabels[selectedPayment.type] : 'Все услуги'}
            </p>
            <p className="text-2xl font-bold text-[#10B981]">
              {selectedPayment ? selectedPayment.amount.toLocaleString('ru-RU') : totalPending.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      )}

      {/* Rent Payment Modal */}
      {showRentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#12121A] border border-[#27273A] rounded-3xl p-6 mx-4 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#F8FAFC]">Оплата аренды</h3>
              <button
                onClick={() => setShowRentModal(false)}
                className="w-9 h-9 bg-[#1A1A25] rounded-xl flex items-center justify-center text-[#64748B]"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-[#94A3B8] mb-3">Стоимость: 45 000 ₽/месяц</p>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setRentMonths(Math.max(1, rentMonths - 1))}
                  className="w-12 h-12 bg-[#1A1A25] rounded-xl flex items-center justify-center text-[#F8FAFC] font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-bold text-[#60A5FA]">{rentMonths}</span>
                  <span className="text-sm text-[#64748B] ml-1">{rentMonths === 1 ? 'месяц' : rentMonths < 5 ? 'месяца' : 'месяцев'}</span>
                </div>
                <button
                  onClick={() => setRentMonths(Math.min(12, rentMonths + 1))}
                  className="w-12 h-12 bg-[#1A1A25] rounded-xl flex items-center justify-center text-[#F8FAFC] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#1A1A25] rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#94A3B8]">Итого к оплате:</span>
                <span className="text-2xl font-bold text-[#60A5FA]">{(45000 * rentMonths).toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowRentModal(false);
                setShowPaymentModal(true);
                setTimeout(() => setShowPaymentModal(false), 2000);
              }}
              className="w-full py-3.5 bg-nova-primary text-white rounded-xl font-bold"
            >
              Оплатить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
