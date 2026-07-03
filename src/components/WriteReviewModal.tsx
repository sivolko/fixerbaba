import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Sparkles, MessageSquare, User, Smartphone } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    userName: string;
    rating: number;
    text: string;
    serviceName: string;
    source: string;
  }) => Promise<void>;
}

export default function WriteReviewModal({ isOpen, onClose, onSubmit }: WriteReviewModalProps) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [serviceName, setServiceName] = useState('iPhone Display Glass Refurbishing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const servicesList = [
    'iPhone Display Glass Refurbishing',
    'MacBook Screen Replacement',
    'Core Diagnostic Clean-up',
    'iPad High-Capacity Battery Swap',
    'iPad Digitizer Shock Injury Fix',
    'Ultimate Full Device Diagnosis',
    'General Mobile / Laptop Repair'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please provide your name');
      return;
    }
    if (!text.trim()) {
      setError('Please share your review comments');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        userName,
        rating,
        text,
        serviceName,
        source: 'Google Review'
      });
      // Clear form and close
      setUserName('');
      setRating(5);
      setText('');
      setServiceName(servicesList[0]);
      onClose();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-full max-w-lg bg-bento-card text-bento-text border border-bento-border rounded-[32px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative transition-colors duration-300"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-bento-border/70 flex items-center justify-between shrink-0 bg-bento-card">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#4285F4]/10 rounded-xl flex items-center justify-center text-[#4285F4]">
                    <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-bento-text flex items-center gap-1.5 leading-none">
                      Write a Google Review
                    </h3>
                    <p className="text-[10px] text-bento-sub font-semibold mt-1">
                      Share your experience with FixerBaba Koramangala
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-bento-sub hover:text-bento-text hover:bg-bento-bg rounded-full transition-colors cursor-pointer"
                  aria-label="Close review modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-bento-text uppercase tracking-wider block">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bento-sub" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Priyanjali Sen"
                      className="w-full pl-10 pr-4 py-2.5 bg-bento-bg text-bento-text placeholder-bento-sub/50 border border-bento-border/70 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#4285F4] transition-all"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-bento-text uppercase tracking-wider block">
                    Service Performed
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bento-sub" />
                    <select
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-bento-bg text-bento-text border border-bento-border/70 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#4285F4] transition-all appearance-none cursor-pointer"
                    >
                      {servicesList.map((service, idx) => (
                        <option key={idx} value={service} className="bg-bento-card text-bento-text">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-bento-text uppercase tracking-wider block">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-amber-500 ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-bento-text uppercase tracking-wider block">
                    Your Review Comments
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-bento-sub" />
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      placeholder="e.g. Excellent doorstep repair. Ashok was extremely polite, quick, and efficient. Fully original parts verified!"
                      className="w-full pl-10 pr-4 py-2.5 bg-bento-bg text-bento-text placeholder-bento-sub/50 border border-bento-border/70 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#4285F4] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#4285F4] hover:bg-[#3574de] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Posting Review...' : 'Post Review'}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
