import { AlertTriangle, X, Phone } from 'lucide-react';

interface EmergencyAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmergencyAlert({ 
  isVisible, 
  title, 
  message, 
  onClose, 
  onAction, 
  actionLabel 
}: EmergencyAlertProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] animate-slide-down">
      <div 
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, #EF4444 0%, #F472B6 100%)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)'
        }}
      >
        <div className="max-w-[480px] mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} className="text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-base text-white mb-1">{title}</h3>
              <p className="text-sm text-white/90 mb-3">{message}</p>
              
              {onAction && actionLabel && (
                <button
                  onClick={onAction}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#EF4444] rounded-xl text-sm font-bold hover:bg-white/90 transition-all"
                >
                  <Phone size={16} />
                  {actionLabel}
                </button>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-down {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-down {
    animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;
document.head.appendChild(style);
