import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  ChevronLeft,
  Wrench,
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

export default function IndustrialHero({ 
  onBookClick, 
  onExploreClick, 
  onSelectSearch,
  selectedArea = BANGALORE_AREAS[0],
  onAreaChange
}: IndustrialHeroProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      const scrollStep = container.clientWidth < 640 ? 205 : 265;
      let nextScrollLeft = container.scrollLeft + scrollStep;
      
      if (container.scrollLeft >= maxScrollLeft - 15) {
        nextScrollLeft = 0;
      }
      
      container.scrollTo({
        left: nextScrollLeft,
        behavior: 'smooth'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Fallback image pool to ensure we always have beautiful, high-quality display assets if some of the 1.jpeg - 20.jpeg are empty or failing to load.
  const fallbackImages = [
    'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=600', // micro-soldering
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', // lab cleanroom
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', // electronic board
    'https://images.unsplash.com/photo-1597484211616-39196ef64c5e?auto=format&fit=crop&q=80&w=600', // precision laser
    'https://images.unsplash.com/photo-1540579859007-b459a538ae6b?auto=format&fit=crop&q=80&w=600', // clean workplace
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600', // optical fusion
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600', // CPU core
    'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=600', // laser engraving
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', // engineer test
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600', // sleek device
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600', // premium sleek design
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', // modern architecture
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600', // sleek structure
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600', // dark tech workstation
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600', // high tech hardware
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600', // robotic fusion
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600', // industrial control
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600', // mobile layout
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=600', // microchips
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600'  // phone service
  ];

  // Use images exclusively from public/photos (fallback to unsplash if any fail).
  const photos = [
    '/photos/1.jpeg','/photos/2.png','/photos/10.jpeg','/photos/11.jpeg','/photos/12.jpeg','/photos/13.jpeg','/photos/14.jpeg','/photos/15.jpeg','/photos/16.jpeg','/photos/17.jpeg','/photos/18.jpeg','/photos/19.jpeg','/photos/21.jpeg'
  ];

  const mobileTitles = [
    'Cracked Screen Replacement',
    'Battery Replacement',
    'Camera Module Repair',
    'Charging Port Fix',
    'Water Damage Restoration',
    'Speaker & Mic Repair',
    'Home Button / Sensor Repair',
    'Back Glass Replacement',
    'Motherboard Diagnostics',
    'Firmware & Software Service',
    'Display Calibration',
    'Battery Health Optimization',
    'Tablet Digitizer Alignment',
    'Smartwatch Screen Repair',
    'Haptic Motor Repair',
    'Flex Cable Re-soldering',
    'Thermal Shielding Fix',
    'LOCA Glass Reflow',
    'Frame & Chassis Repair',
    'Data Recovery & Backup',
    'Waterproof Seal Testing',
    'Panel Adhesive Re-lamination',
    'Precision Micro-Soldering',
    'Diagnostic Microscope Inspection',
    'Certified Technician Service'
  ];

  const mobileCategories = [
    'Screen','Battery','Camera','Charging','Water Damage','Audio','Sensor','Back Glass','Motherboard','Software','Display','Battery','Tablet','Smartwatch','Haptic','Flex','Thermal','LOCA','Frame','Data','Diagnostics','Panel','Soldering','Inspection','Certified'
  ];

  // Build 25 hero items cycling through available photos
  const heroImages: HeroImageItem[] = Array.from({ length: 25 }).map((_, i) => {
    const idx = i % photos.length;
    return {
      id: String(i+1).padStart(2,'0'),
      url: photos[idx],
      fallbackUrl: fallbackImages[idx % fallbackImages.length],
      tag: `[MOBILE_${String(i+1).padStart(2,'0')}]`,
      title: mobileTitles[i % mobileTitles.length],
      specs: `${mobileCategories[i % mobileCategories.length]} service · Expert technicians · 30-day warranty`,
      category: mobileCategories[i % mobileCategories.length]
    } as HeroImageItem;
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    const container = scrollContainerRef.current;
    container.scrollTo({
      left: container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-radial from-[#1e1c2e] via-[#0b0a11] to-[#050407] p-4 sm:p-6 md:p-8 lg:p-12 transition-colors duration-300">
      {/* Outer Glow Elements to replicate the stunning screenshot background */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-900/15 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-900/15 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Elegant Rounded browser-like monitor container from the genomic screenshot */}
      <div className="relative w-full max-w-7xl mx-auto bg-[#faf9f6] text-neutral-900 rounded-[32px] sm:rounded-[48px] shadow-2xl border border-white/10 overflow-hidden flex flex-col pt-8 pb-12 px-6 sm:px-10 lg:px-14">
        
        {/* Master Column Area with Title and Genomic Vibe */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 mb-12">
          {/* Main Title Heading using the gorgeous pill badge highlight */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-neutral-900 font-sans leading-[1.1] max-w-3xl">
            Revolutionizing{' '}
            <span className="bg-neutral-900 text-[#faf9f6] px-6 py-1.5 sm:py-2 mx-1 sm:mx-2 rounded-full inline-flex items-center justify-center font-bold tracking-tight shadow-md select-none transform hover:scale-105 transition-transform duration-300">
              device care
            </span>{' '}
            with micro-engineering
          </h1>

          {/* Beautifully balanced secondary description */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-500 leading-relaxed max-w-2xl">
            Empowering smartphone and laptop users with advanced glass-only screen re-lamination, microscopic chip diagnostic repairs, and pristine cleanroom calibration.
          </p>

          {/* Minimalist action pills below text */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBookClick}
              className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current text-amber-300" />
              <span>Book Appointment (₹0 visit)</span>
            </button>
            <div className="relative bg-white/85 hover:bg-white border border-neutral-200/90 text-neutral-800 px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] inline-flex items-center gap-2 shadow-xs cursor-pointer select-none">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => onAreaChange?.(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-4 font-extrabold appearance-none"
              >
                {BANGALORE_AREAS.map((area) => (
                  <option key={area} value={area} className="bg-white text-neutral-850">
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3.5 pointer-events-none" />
            </div>
          </div>
        </div>



        {/* Dynamic Image Shelf Header with Trending Status Indicator */}
        <div className="flex items-center justify-between border-t border-neutral-200/55 pt-8 mb-4 mt-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
            <span className="text-xs sm:text-sm font-black text-rose-600 uppercase tracking-widest font-mono flex items-center gap-2">
              <span>VERIFIED CUSTOMER REVIEWS</span>
              <span className="text-[10px] text-neutral-500 font-bold bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/60">
                01-25
              </span>
            </span>
          </div>
          
          {/* Scroll Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Facebook Stories-style Scroll Carousel of Vertical Cards */}
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto flex gap-5 py-4 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
          >
            {heroImages.map((item, idx) => {
              const isFailed = failedImages[item.id];
              const imgSrc = isFailed ? item.fallbackUrl : item.url;
              
              // Map index to neon border glow styles from the uploaded reference
              const borderGlows = [
                'border-blue-500/85 shadow-[0_0_12px_rgba(59,130,246,0.3)] hover:shadow-[0_0_22px_rgba(59,130,246,0.6)]',
                'border-emerald-500/85 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_22px_rgba(16,185,129,0.6)]',
                'border-orange-500/85 shadow-[0_0_12px_rgba(249,115,22,0.3)] hover:shadow-[0_0_22px_rgba(249,115,22,0.6)]',
                'border-rose-500/85 shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:shadow-[0_0_22px_rgba(244,63,94,0.6)]',
                'border-purple-500/85 shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:shadow-[0_0_22px_rgba(168,85,247,0.6)]',
                'border-cyan-500/85 shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)]',
                'border-amber-500/85 shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.6)]'
              ];
              const glowClass = borderGlows[idx % borderGlows.length];

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onSelectSearch(item.category)}
                  className={`flex-shrink-0 w-[185px] sm:w-[225px] md:w-[245px] aspect-[9/14] sm:aspect-[10/16] rounded-[24px] overflow-hidden relative border-[3px] transition-all duration-300 hover:scale-[1.04] cursor-pointer snap-start group ${glowClass}`}
                >
                  {/* Image Background */}
                  <img
                    src={imgSrc}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => {
                      setFailedImages(prev => ({ ...prev, [item.id]: true }));
                    }}
                  />

                  {/* Scrim Overlay for Contrast */}
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/10 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-0" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/75 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Top-Right Index Identifier */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-black/60 backdrop-blur-sm text-neutral-300 text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm border border-white/5">
                      #{item.id}
                    </span>
                  </div>

                  {/* Bottom Text Elements aligned beautifully over the scrim */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end text-left z-10 select-none">
                    {/* Tag Label */}
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase text-[#4285F4] tracking-wider mb-1 block">
                      {item.tag}
                    </span>
                    
                    {/* Main Title Heading */}
                    <h4 className="text-xs sm:text-sm md:text-base font-black text-white tracking-tight leading-tight mb-1.5 drop-shadow-md group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h4>
                    
                    {/* Diagnostic Specifications */}
                    <p className="text-[9px] sm:text-[10px] font-semibold text-neutral-300/90 line-clamp-2 leading-tight font-mono">
                      {item.specs}
                    </p>
                    
                    {/* Expand Micro Prompt */}
                    <div className="mt-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-[8px] sm:text-[9px] text-white font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span>Initiate Repair</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fallback hidden scrollbar custom rules */}
          <style>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        {/* Industrial Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-200/55">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h5 className="text-[10px] font-black uppercase text-neutral-800">Zero Dust Process</h5>
              <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">Class 100 Laminators</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h5 className="text-[10px] font-black uppercase text-neutral-800">45-Min SLA Turnaround</h5>
              <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">Koramangala express service</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500/10 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h5 className="text-[10px] font-black uppercase text-neutral-800">Authentic Panel Save</h5>
              <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">Original OLED preserved</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500/10 text-[#4285F4] rounded-lg flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h5 className="text-[10px] font-black uppercase text-neutral-800">30-Day Baba Warranty</h5>
              <p className="text-[9px] text-neutral-500 font-semibold mt-0.5">No-risk post-service shield</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
