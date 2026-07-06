import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Clock, CheckCircle, ShieldCheck, Heart, Share2, CornerDownRight } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceDetailDrawerProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (service: ServiceItem) => void;
  isInCart: boolean;
  whatsappUrl?: string;
}

export default function ServiceDetailDrawer({
  service,
  isOpen,
  onClose,
  onAddToCart,
  isInCart,
  whatsappUrl
}: ServiceDetailDrawerProps) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900 z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-bento-card text-bento-text shadow-2xl z-50 overflow-y-auto border-l border-bento-border transition-colors"
          >
            {/* Image Header */}
            <div className="relative h-64 w-full bg-bento-bg">
              <img
                src={service.image}
                alt={service.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Share & Like Buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-md transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-md transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Category over image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-amber-500 rounded-full text-black">
                  {service.category}
                </span>
                <h3 className="text-xl font-bold font-display mt-2 drop-shadow-sm">
                  {service.name}
                </h3>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="p-6 border-b border-bento-border bg-bento-card transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-amber-550/10 px-2.5 py-1 rounded text-amber-600 dark:text-amber-400 font-medium text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{service.rating}</span>
                  <span className="text-bento-sub text-xs">({service.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-bento-sub text-sm font-medium">
                  <Clock className="w-4 h-4 text-bento-sub/80" />
                  <span>{service.duration} Estim.</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Request Free Diagnostics Estimate
                </span>
              </div>
            </div>

            {/* Inclusions Detail */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-extrabold text-bento-sub tracking-wider mb-3">
                  Service Scope & Inclusions
                </h4>
                <p className="text-bento-text md:opacity-90 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="space-y-3 bg-bento-bg p-4 rounded-xl border border-bento-border">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2.5">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-bento-text/95 text-xs font-medium leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Section */}
              <div className="p-4 bg-neutral-950 text-white rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-xs tracking-wide uppercase text-amber-400 font-display">
                    FixerBaba Trust Guarantee
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  ✓ Background certified partner • ✓ No-mess service delivery • ✓ 30-Day unconditional free repair cover coverage.
                </p>
              </div>

              {/* Simple workflow overview */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">
                  How it works
                </h4>
                <div className="space-y-3 pl-1 pt-1.5">
                  <div className="flex gap-3 text-xs text-neutral-600">
                    <span className="font-extrabold text-neutral-900">1.</span>
                    <p>Select your convenient date and 1-hour service arrival slot inside checkout.</p>
                  </div>
                  <div className="flex gap-3 text-xs text-neutral-600">
                    <span className="font-extrabold text-neutral-900">2.</span>
                    <p>Verified service expert arrives with official specialized repair toolkits.</p>
                  </div>
                  <div className="flex gap-3 text-xs text-neutral-600">
                    <span className="font-extrabold text-neutral-900">3.</span>
                    <p>Experience hassle-free repair. Pay securely after service completion.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="sticky bottom-0 p-4 border-t border-neutral-200 bg-white/90 backdrop-blur-md flex items-center gap-3">
              <a
                href={whatsappUrl || 'https://wa.me/+919535377862'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide text-center bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Contact on WhatsApp
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
