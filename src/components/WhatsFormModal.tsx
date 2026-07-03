import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface WhatsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsFormModal({ isOpen, onClose }: WhatsFormModalProps) {
  const whatsFormUrl = 'https://whatsform.com/Qva76Y';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/80 z-50 cursor-pointer backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-full max-w-3xl bg-bento-card text-bento-text border border-bento-border rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto h-[90vh] max-h-[850px] relative transition-colors duration-300"
            >
              {/* Top Custom Header */}
              <div className="px-6 py-4 border-b border-bento-border/70 flex items-center justify-between shrink-0 bg-bento-card transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#25D366]/10 dark:bg-[#25D366]/20 rounded-xl flex items-center justify-center text-[#25D366]">
                    <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-bento-text flex items-center gap-1.5 leading-none">
                      Express Repair Booking
                      <span className="hidden sm:inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 py-0.5 px-2 rounded-full font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-2.5 h-2.5" /> Checked
                      </span>
                    </h3>
                    <p className="text-[10px] text-bento-sub font-semibold mt-1">
                      Direct WhatsApp-integrated scheduling and pricing
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-bento-sub hover:text-bento-text hover:bg-bento-bg rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                    title="Open on WhatsForm in New Tab"
                  >
                    <span className="hidden sm:inline">Launch New Tab</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={onClose}
                    className="p-2 text-bento-sub hover:text-bento-text hover:bg-bento-bg rounded-full transition-colors cursor-pointer"
                    aria-label="Close form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Informative Toast Banner */}
              <div className="bg-emerald-500/5 px-6 py-2.5 border-b border-emerald-500/10 flex items-center gap-2 text-[11px] text-bento-text/90 shrink-0 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Fill out the quick form below to receive immediate repair estimates on your WhatsApp number!</span>
              </div>

              {/* Interactive Form iFrame */}
              <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 overflow-hidden relative">
                <iframe
                  src={whatsFormUrl}
                  title="FixerBaba WhatsForm Booking"
                  className="w-full h-full border-none"
                  allow="geolocation; microphone; camera"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Minimal Footnote bar */}
              <div className="px-6 py-3 border-t border-bento-border/70 shrink-0 bg-bento-card text-center text-[10px] text-bento-sub font-bold tracking-wide uppercase flex flex-col sm:flex-row items-center justify-between gap-1 transition-colors">
                <span>Secure • No Advance Pay • FixerBaba Genuine Partner Grid</span>
                <span className="hidden sm:block">Bengaluru Technical Team Support</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
