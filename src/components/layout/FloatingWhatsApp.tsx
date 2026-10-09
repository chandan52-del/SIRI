import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl, buildGeneralChatMessage } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  if (!settings.whatsappNumber) return null;

  const chatUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    buildGeneralChatMessage(settings.storeName)
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2 pointer-events-none">
      {/* Tooltip */}
      {showTooltip && (
        <div className="pointer-events-auto bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-3.5 max-w-xs flex items-start gap-3 animate-bounce-subtle text-left mb-1">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 fill-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-900">Need help or want to order?</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Chat directly with our team on WhatsApp for instant assistance.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Floating Button */}
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all duration-300"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white stroke-[1.8]" />
      </a>
    </div>
  );
};
