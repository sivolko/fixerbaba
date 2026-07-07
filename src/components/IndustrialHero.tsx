import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Cpu,
  Layers,
  CheckCircle,
  Clock,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { BANGALORE_AREAS } from '../data';

interface IndustrialHeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
  onSelectSearch: (query: string) => void;
  selectedArea?: string;
  onAreaChange?: (area: string) => void;
}

interface HeroImageItem {
  id: string;
  url: string;
  fallbackUrl: string;
  tag: string;
  title: string;
  specs: string;
  category: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function IndustrialHero({
  onBookClick,
  onExploreClick,
  onSelectSearch,
  selectedArea = BANGALORE_AREAS[0],
  onAreaChange
}: IndustrialHeroProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [track, setTrack] = useState({ widthPct: 20, leftPct: 0 });

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const draggedDistanceRef = useRef(0);
  const tickingRef = useRef(false);
  const reducedMotionRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Fallback image pool to guarantee a polished visual even if a local photo fails to load.
  const fallbackImages = [
    'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1597484211616-39196ef64c5e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1540579859007-b459a538ae6b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600'
  ];

  const photos = [
    '/photos/1.jpeg', '/photos/2.png', '/photos/10.jpeg', '/photos/11.jpeg', '/photos/12.jpeg',
    '/photos/13.jpeg', '/photos/14.jpeg', '/photos/15.jpeg', '/photos/16.jpeg', '/photos/17.jpeg',
    '/photos/18.jpeg', '/photos/19.jpeg', '/photos/21.jpeg'
  ];

  const mobileTitles = [
    'Cracked Screen Replacement', 'Battery Replacement', 'Camera Module Repair', 'Charging Port Fix',
    'Water Damage Restoration', 'Speaker & Mic Repair', 'Home Button / Sensor Repair', 'Back Glass Replacement',
    'Motherboard Diagnostics', 'Firmware & Software Service', 'Display Calibration', 'Battery Health Optimization',
    'Tablet Digitizer Alignment', 'Smartwatch Screen Repair', 'Haptic Motor Repair', 'Flex Cable Re-soldering',
    'Thermal Shielding Fix', 'LOCA Glass Reflow', 'Frame & Chassis Repair', 'Data Recovery & Backup',
    'Waterproof Seal Testing', 'Panel Adhesive Re-lamination', 'Precision Micro-Soldering',
    'Diagnostic Microscope Inspection', 'Certified Technician Service'
  ];

  const mobileCategories = [
    'Screen', 'Battery', 'Camera', 'Charging', 'Water Damage', 'Audio', 'Sensor', 'Back Glass', 'Motherboard',
    'Software', 'Display', 'Battery', 'Tablet', 'Smartwatch', 'Haptic', 'Flex', 'Thermal', 'LOCA', 'Frame',
    'Data', 'Diagnostics', 'Panel', 'Soldering', 'Inspection', 'Certified'
  ];

  const heroImages: HeroImageItem[] = Array.from({ length: 25 }).map((_, i) => {
    const idx = i % photos.length;
    return {
      id: String(i + 1).padStart(2, '0'),
      url: photos[idx],
      fallbackUrl: fallbackImages[idx % fallbackImages.length],
      tag: `MOBILE_${String(i + 1).padStart(2, '0')}`,
      title: mobileTitles[i % mobileTitles.length],
      specs: `${mobileCategories[i % mobileCategories.length]} service · 30-day warranty`,
      category: mobileCategories[i % mobileCategories.length]
    } as HeroImageItem;
  });

  const getCardStep = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>('[data-card="true"]');
    return card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
  }, []);

  const updateTrack = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (el) {
        const widthPct = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
        const scrollable = el.scrollWidth - el.clientWidth;
        const leftPct = scrollable > 0 ? (el.scrollLeft / scrollable) * (100 - widthPct) : 0;
        setTrack({ widthPct, leftPct });
      }
      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    updateTrack();
    window.addEventListener('resize', updateTrack);
    return () => window.removeEventListener('resize', updateTrack);
  }, [updateTrack]);

  // Gentle, continuous auto-advance — one card at a time, paused on any interaction.
  useEffect(() => {
    if (isPaused || isDragging || reducedMotionRef.current) return;
    const id = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const step = getCardStep();
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + step;
      el.scrollTo({ left: next > max - 4 ? 0 : next, behavior: 'smooth' });
    }, 3200);
    return () => clearInterval(id);
  }, [isPaused, isDragging, getCardStep]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = getCardStep();
    el.scrollTo({
      left: el.scrollLeft + (direction === 'left' ? -step : step),
      behavior: 'smooth'
    });
  };

  // Desktop mouse drag-to-scroll — touch devices keep native momentum scrolling.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    draggedDistanceRef.current = 0;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    draggedDistanceRef.current = Math.abs(dx);
    el.scrollLeft = dragStartScrollRef.current - dx;
  };

  const endDrag = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const onCardClick = (category: string) => {
    if (draggedDistanceRef.current > 6) return;
    onSelectSearch(category);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); handleScroll('right'); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); handleScroll('left'); }
  };

  return (
    <section className="sf-font relative w-full max-w-7xl mx-auto flex flex-col pt-10 pb-16 px-6 sm:px-10 lg:px-14 text-neutral-900">

        {/* Hero copy */}
        <motion.div
          initial={reducedMotionRef.current ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 mb-14"
        >
          <h1 className="text-[2.35rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold tracking-tight text-neutral-900">
            Revolutionizing{' '}
            <span className="bg-neutral-900 text-[#faf9f6] px-5 py-1 sm:px-6 sm:py-1.5 mx-0.5 sm:mx-1.5 rounded-full inline-flex items-center justify-center font-semibold tracking-tight">
              device care
            </span>{' '}
            with micro-engineering
          </h1>

          <p className="text-[15px] sm:text-lg font-normal text-neutral-500 leading-relaxed max-w-xl">
            Advanced glass-only re-lamination, microscopic chip diagnostics, and cleanroom-grade
            calibration — for the smartphones and laptops you actually rely on.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBookClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-[13px] font-semibold tracking-tight transition-all hover:scale-[1.02] active:scale-[0.97] inline-flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.55)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current text-amber-200" />
              <span>WhatsApp booking</span>
            </button>

            <div className="relative bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 px-6 py-3 rounded-full text-[13px] font-semibold tracking-tight transition-all inline-flex items-center gap-2 shadow-sm cursor-pointer select-none">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => onAreaChange?.(e.target.value)}
                aria-label="Select service area"
                className="bg-transparent focus:outline-none cursor-pointer pr-4 font-semibold appearance-none"
              >
                {BANGALORE_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-5 pointer-events-none" />
            </div>

            <button
              onClick={onExploreClick}
              className="text-neutral-500 hover:text-neutral-900 px-3 py-3 text-[13px] font-medium tracking-tight transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>See all services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Section eyebrow */}
        <div className="flex items-center gap-2.5 border-t border-neutral-200/60 pt-8 mb-5">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Verified customer reviews
          </h3>
          <span className="text-[11px] font-medium text-neutral-400">· 25 repairs</span>
        </div>

        {/* Carousel */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); endDrag(); }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={scrollContainerRef}
            role="region"
            aria-label="Customer repair stories, scrollable"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onScroll={updateTrack}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`no-scrollbar w-full overflow-x-auto flex gap-5 py-2 px-1 snap-x snap-proximity focus:outline-none select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
          >
            {heroImages.map((item, idx) => {
              const isFailed = failedImages[item.id];
              const imgSrc = isFailed ? item.fallbackUrl : item.url;

              return (
                <motion.div
                  key={item.id}
                  data-card="true"
                  initial={reducedMotionRef.current ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: Math.min(idx, 8) * 0.04, ease: EASE }}
                  onClick={() => onCardClick(item.category)}
                  className="group relative flex-shrink-0 snap-start w-[76%] xs:w-[270px] sm:w-[232px] md:w-[250px] lg:w-[264px] aspect-[3/4] rounded-[26px] overflow-hidden bg-neutral-200 border border-neutral-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_28px_-10px_rgba(0,0,0,0.16)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_48px_-14px_rgba(0,0,0,0.26)] hover:-translate-y-1.5 transition-[transform,box-shadow] duration-500 ease-out cursor-pointer"
                >
                  <img
                    src={imgSrc}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    onError={() => setFailedImages((prev) => ({ ...prev, [item.id]: true }))}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-medium text-white/45 tabular-nums">
                      {item.id}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h4 className="text-[13.5px] sm:text-[15px] font-semibold text-white leading-snug tracking-tight">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[10.5px] sm:text-[11px] text-white/55 leading-snug line-clamp-1">
                      {item.specs}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Book this repair</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Edge fades matching the page background, not a new colour */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Floating nav controls */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll to previous story"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-md items-center justify-center text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll to next story"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-md items-center justify-center text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress track */}
        <div className="relative mt-4 mx-1 h-[3px] rounded-full bg-neutral-900/10 overflow-hidden">
          <div
            className="absolute top-0 h-full rounded-full bg-neutral-900/60"
            style={{ width: `${track.widthPct}%`, left: `${track.leftPct}%`, transition: 'left 120ms linear' }}
          />
        </div>

        {/* Trust strip */}
        <motion.div
          initial={reducedMotionRef.current ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 mt-10 pt-8 border-t border-neutral-200/60"
        >
          {[
            { icon: CheckCircle, title: 'Zero Dust Process', sub: 'Class 100 laminators' },
            { icon: Clock, title: '45-Min SLA Turnaround', sub: 'Koramangala express service' },
            { icon: Cpu, title: 'Authentic Panel Save', sub: 'Original OLED preserved' },
            { icon: Layers, title: '30-Day Baba Warranty', sub: 'No-risk post-service shield' }
          ].map(({ icon: Icon, title, sub }, i) => (
            <div
              key={title}
              className={`flex items-center gap-3 md:pl-4 ${i > 0 ? 'md:border-l md:border-neutral-200/60' : ''}`}
            >
              <div className="w-9 h-9 bg-neutral-900/5 text-neutral-800 rounded-full flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-semibold text-neutral-800 tracking-tight">{title}</h5>
                <p className="text-[10.5px] text-neutral-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

      <style>{`
        .sf-font {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
            "Helvetica Neue", ui-sans-serif, system-ui, Arial, sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
