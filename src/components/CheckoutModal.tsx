import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, Contact, CreditCard, Shield, Sparkles, Receipt } from 'lucide-react';
import { CartItem, Booking } from '../types';
import { BANGALORE_AREAS } from '../data';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
  onPlaceBooking: (booking: Booking) => void;
  isPlusMember?: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onClearCart,
  onPlaceBooking,
  isPlusMember = false
}: CheckoutModalProps) {
  // Booking Customizations
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM - 1:00 PM');
  
  // Address parameters
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [flatRoom, setFlatRoom] = useState<string>('');
  const [area, setArea] = useState<string>(BANGALORE_AREAS[0]);
  const [landmark, setLandmark] = useState<string>('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState<string>('BABA100');
  const [couponApplied, setCouponApplied] = useState<boolean>(true);
  
  // Error handling
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (cart.length === 0) return null;

  // Bill mathematics (no longer active due to quote-only requirements)
  const itemsSubtotal = 0;

  // Generation options for dates
  const dates = [
    { label: 'Today', sub: 'Urgent' },
    { label: 'Tomorrow', sub: 'Standard' },
    { label: '15th June', sub: 'Convenient' },
    { label: '16th June', sub: 'Convenient' }
  ];

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '05:00 PM - 07:00 PM'
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please specify target occupant full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!flatRoom.trim()) {
      setErrorMsg('Please enter flat, house or room details.');
      return;
    }

    const newBooking: Booking = {
      id: 'FB-' + Math.floor(100000 + Math.random() * 900000),
      status: 'confirmed',
      items: [...cart],
      dateSlot: selectedDate,
      timeSlot: selectedTime,
      address: {
        fullName,
        phone,
        flatRoom,
        area,
        landmark
      },
      createdAt: new Date().toISOString(),
      totalAmount: 0
    };

    onPlaceBooking(newBooking);
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900 z-50 cursor-pointer backdrop-blur-xs"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="w-full max-w-2xl bg-bento-card text-bento-text border border-bento-border rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto max-h-[90vh]"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-bento-sub hover:text-bento-text hover:bg-bento-bg rounded-full transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Form Info (Scrollable) */}
              <form
                onSubmit={handleBookingSubmit}
                className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[80vh] md:max-h-[90vh]"
              >
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider text-amber-600 bg-amber-550/15 px-2.5 py-1 rounded-full uppercase">
                    Express Estimation Portal
                  </span>
                  <h3 className="text-xl font-bold font-display text-bento-text mt-2">
                    Request Quote &amp; Book
                  </h3>
                  <p className="text-xs text-bento-sub">
                    No-charge diagnostics visit. We provide locked quotes prior to starting any job.
                  </p>
                </div>

                {/* 1. Schedule Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-bento-sub uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Select Arrival Day</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {dates.map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setSelectedDate(d.label)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedDate === d.label
                            ? 'border-bento-blue bg-bento-bg text-bento-text shadow-xs font-bold'
                            : 'border-bento-border hover:border-neutral-350 bg-bento-card text-bento-text'
                        }`}
                      >
                        <p className="text-xs font-bold text-bento-text">{d.label}</p>
                        <p className="text-[10px] text-bento-sub mt-0.5">{d.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slots selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-bento-sub uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Select Time Slot Window</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold tracking-tight text-center transition-all ${
                          selectedTime === slot
                            ? 'border-bento-blue bg-bento-bg font-bold text-bento-text'
                            : 'border-bento-border hover:border-neutral-350 bg-bento-card text-bento-sub'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Occupant Address Parameter fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-bento-sub uppercase tracking-widest">
                    <Contact className="w-3.5 h-3.5 text-amber-600" />
                    <span>Occupant &amp; Contact Info</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="p-3 bg-bento-bg border border-bento-border rounded-xl text-xs text-bento-text placeholder-neutral-400 focus:outline-none focus:border-bento-blue transition-all font-medium"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="p-3 bg-bento-bg border border-bento-border rounded-xl text-xs text-bento-text placeholder-neutral-400 focus:outline-none focus:border-bento-blue transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-bento-sub uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Service Address Details</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Flat, House No, Wing, Building Name"
                      value={flatRoom}
                      onChange={(e) => setFlatRoom(e.target.value)}
                      className="w-full p-3 bg-bento-bg border border-bento-border rounded-xl text-xs text-bento-text placeholder-neutral-400 focus:outline-none focus:border-bento-blue"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="p-3 bg-bento-bg border border-bento-border rounded-xl text-xs text-bento-text focus:outline-none focus:border-bento-blue cursor-pointer"
                      >
                        {BANGALORE_AREAS.map((ar) => (
                          <option key={ar} value={ar} className="bg-bento-card text-bento-text">
                            {ar} (Bengaluru)
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="p-3 bg-bento-bg border border-bento-border rounded-xl text-xs text-bento-text placeholder-neutral-400 focus:outline-none focus:border-bento-blue"
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-500 text-xs font-semibold bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-bento-blue hover:bg-bento-blue-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider active:scale-98 transition-all shadow-md hover:shadow-lg pointer-events-auto cursor-pointer"
                >
                  Confirm Zero-Fee Quote &amp; Booking
                </button>
              </form>

              {/* Right Column: Order Bill Breakdown (Obsidian slate styling) */}
              <div className="w-full md:w-64 bg-neutral-900 text-white p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Receipt className="w-4 h-4" />
                      <span className="text-[10px] tracking-widest font-extrabold uppercase">
                        Request Summary
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">Review items in your quote</p>
                  </div>

                  {/* Cart Summary List */}
                  <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.service.id} className="flex justify-between items-start text-xs border-b border-neutral-800 pb-2">
                        <div>
                          <p className="font-semibold text-neutral-100 line-clamp-1">{item.service.name}</p>
                          <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-neutral-300">
                          Estimate Needed
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Section */}
                  <div className="bg-neutral-800/40 p-3 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Zero-Obligation Visit</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Our diagnostic visits are entirely free. Denying a service after receiving a quote incurs ₹0 charge.</p>
                  </div>

                  {/* Calculation Details */}
                  <div className="space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Diagnostics visit fee</span>
                      <span className="text-green-400 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Locked quotes guarantee</span>
                      <span>Included</span>
                    </div>
                  </div>
                </div>

                {/* Absolute Total and payment policy */}
                <div className="space-y-4 pt-6 border-t border-neutral-800 mt-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Initial Payable</span>
                    <span className="text-2xl font-extrabold text-amber-400">
                      ₹0
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-[10px] text-neutral-400 bg-neutral-950 p-2.5 rounded-lg">
                    <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>You pay absolutely nothing now. Our engineers will offer a precise physical repair estimate for approval.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
