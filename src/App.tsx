import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Search,
  Star,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle,
  Phone,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Wrench,
  ExternalLink,
  HelpCircle,
  Tv,
  Droplet,
  Zap,
  Brush,
  Hammer,
  Package,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Award,
  Users,
  Percent,
  Leaf,
  FlaskConical,
  X,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data & Helpers
import {
  BANGALORE_AREAS,
  AREA_WHATSAPP_LINKS,
  SERVICE_CATEGORIES,
  SERVICES_INVENTORY,
  STEPPING_TILES_REVIEWS,
  FAQS
} from './data';
import { ServiceItem, CartItem, Booking, BookingStatus } from './types';

// Curated Components
import ServiceDetailDrawer from './components/ServiceDetailDrawer';
import CheckoutModal from './components/CheckoutModal';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import WhatsFormModal from './components/WhatsFormModal';
import WriteReviewModal from './components/WriteReviewModal';
import { BrandLogo } from './components/BrandLogo';
import { LiveRepairBench } from './components/LiveRepairBench';
import IndustrialHero from './components/IndustrialHero';

// Firebase Helpers
import {
  seedReviewsIfEmpty,
  fetchReviewsFromFirestore,
  addReviewToFirestore,
  saveBookingToFirestore,
  getBookingsFromFirestore
} from './firebase';

const bentoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const bentoCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 16
    }
  }
};

export default function App() {
  // Global states
  const [selectedArea, setSelectedArea] = useState<string>(BANGALORE_AREAS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Interface Openers
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedDetailService, setSelectedDetailService] = useState<ServiceItem | null>(null);
  const [isWhatsFormOpen, setIsWhatsFormOpen] = useState<boolean>(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState<boolean>(false);
  
  // Reviews state (initially loaded from local file, synced with Firebase)
  const [reviews, setReviews] = useState<any[]>(STEPPING_TILES_REVIEWS);
  
  const reviewsContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsContainerRef.current) {
      const scrollAmount = reviewsContainerRef.current.clientWidth;
      reviewsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Cart management (local state)
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Active Bookings simulation tracking list
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [isPlusMember, setIsPlusMember] = useState<boolean>(false);
  
  // Dynamic Team Image loader with multiple fallback paths to automatically resolve uploaded images
  const TEAM_IMAGE_SOURCES = [
    '/e374078a-9b28-4708-9662-a1c513b3ab2b.jpeg',
    '/team.webp',
    '/assets/team.webp',
    '/assets/team.jpg',
    '/assets/team.png',
    '/team.jpg',
    '/team.png',
    '/assets/team.jpeg',
    '/team.jpeg',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200'
  ];
  const [teamImgSrc, setTeamImgSrc] = useState<string>(TEAM_IMAGE_SOURCES[0]);
  const [teamImgIndex, setTeamImgIndex] = useState<number>(0);
  
  // Theme management (Light vs. OLED Dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // States to support magnetic tilt hover animations on the feature cards
  const [tiltCard1, setTiltCard1] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0, active: false });
  const [tiltCard2, setTiltCard2] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0, active: false });
  const [tiltCard3, setTiltCard3] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0, active: false });

  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    setTilt: React.Dispatch<React.SetStateAction<{ x: number; y: number; rotateX: number; rotateY: number; active: boolean }>>
  ) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse position from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Coefficients: max tilt ±12 degrees, displacement ±10px
    const tiltX = -relativeY * 12;
    const tiltY = relativeX * 12;
    const transX = relativeX * 10;
    const transY = relativeY * 10;

    setTilt({ x: transX, y: transY, rotateX: tiltX, rotateY: tiltY, active: true });
  };

  const handleCardMouseLeave = (
    setTilt: React.Dispatch<React.SetStateAction<{ x: number; y: number; rotateX: number; rotateY: number; active: boolean }>>
  ) => {
    setTilt({ x: 0, y: 0, rotateX: 0, rotateY: 0, active: false });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Auto scroll top when component loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Firebase initialization: seed and load reviews and bookings
  useEffect(() => {
    const initFirebase = async () => {
      try {
        await seedReviewsIfEmpty();
        const fbReviews = await fetchReviewsFromFirestore();
        setReviews(fbReviews);

        const fbBookings = await getBookingsFromFirestore();
        if (fbBookings && fbBookings.length > 0) {
          // Sort bookings so latest is first
          const sorted = [...fbBookings].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          // If we have an active booking (not completed), track it in state
          const active = sorted.filter((b) => b.status !== 'completed');
          if (active.length > 0) {
            setActiveBookings([active[0]]);
          }
        }
      } catch (err) {
        console.error('Failed to initialize and load Firebase data:', err);
      }
    };
    initFirebase();
  }, []);

  // Simulator interval for status transitions of placed bookings
  useEffect(() => {
    if (activeBookings.length === 0) return;

    const timer = setInterval(() => {
      setActiveBookings((prevBookings) =>
        prevBookings.map((bk) => {
          if (bk.status === 'confirmed') {
            return {
              ...bk,
              status: 'partner_assigned',
              partner: {
                name: 'Ashok Kumar',
                rating: 4.9,
                photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400',
                contact: '+91 98455 20421',
                vehicleNumber: 'KA-05-EX-4120'
              }
            };
          } else if (bk.status === 'partner_assigned') {
            return { ...bk, status: 'arriving' };
          } else if (bk.status === 'arriving') {
            return { ...bk, status: 'in_progress' };
          } else if (bk.status === 'in_progress') {
            return { ...bk, status: 'completed' };
          }
          return bk;
        })
      );
    }, 12000); // Progress status every 12 seconds for visual interest

    return () => clearInterval(timer);
  }, [activeBookings]);

  // Helper mapping for category icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Tablet': return <Tablet className="w-4 h-4" />;
      case 'Watch': return <Watch className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Cart Handlers
  const handleAddToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.service.id === service.id);
      if (exists) {
        return prev.filter((item) => item.service.id !== service.id); // Toggle behavior
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.service.id === serviceId ? { ...item, quantity } : item))
    );
  };

  const handleAddServiceById = (id: string) => {
    const srv = SERVICES_INVENTORY.find((s) => s.id === id);
    if (!srv) return;
    setCart((prev) => {
      const exists = prev.find((item) => item.service.id === id);
      if (exists) return prev; // already there
      return [...prev, { service: srv, quantity: 1 }];
    });
  };

  // Filter logic
  const filteredServices = SERVICES_INVENTORY.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate cart counts
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.service.price * item.quantity, 0);
  const finalSubtotal = isPlusMember ? Math.round(cartSubtotal * 0.85) : cartSubtotal;

  // Status mapping tracker UI
  const getStatusStep = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 1;
      case 'partner_assigned': return 2;
      case 'arriving': return 3;
      case 'in_progress': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-bento-bg flex flex-col justify-between selection:bg-bento-text selection:text-bento-bg transition-colors duration-300">
      {/* 1. Global Navigation Bar header */}
      <header className="sticky top-0 bg-bento-card/85 backdrop-blur-xl border-b border-bento-border/70 z-40 px-4 py-3.5 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-7">
            <a href="/" className="flex items-center">
              <BrandLogo size="sm" />
            </a>

            {/* Selector Area: Apple/Urban style Minimalist Dropdown */}
            <div className="hidden sm:flex items-center gap-2 bg-bento-bg hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-bento-border px-4 py-1.5 rounded-full transition-colors">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs font-bold text-bento-text bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                {BANGALORE_AREAS.map((area) => (
                  <option key={area} value={area} className="bg-bento-card text-bento-text">
                    {area}
                  </option>
                ))}
              </select>
            </div>


          </div>

          {/* Quick Header Options */}
          <div className="flex items-center gap-2.5">
            {/* Direct Book Appointment Button */}
            <button
              onClick={() => setIsWhatsFormOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse text-amber-300" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden text-[10px]">Book Appointment</span>
            </button>

            {/* OLED Mode Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full border border-bento-border bg-bento-card text-bento-text hover:bg-bento-bg/75 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-[#e0e7ff]" />
              )}
            </button>

            {/* Cart Counter Button */}
            <button
              onClick={() => cart.length > 0 && setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full border transition-all flex items-center justify-center ${
                cart.length > 0
                  ? 'border-bento-text bg-bento-text text-bento-bg hover:opacity-90'
                  : 'border-bento-border hover:border-neutral-300 dark:hover:border-neutral-800 bg-bento-card text-bento-sub cursor-not-allowed opacity-60'
              }`}
              title={cart.length > 0 ? 'Checkout Now' : 'Cart is Empty'}
              disabled={cart.length === 0}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-bento-blue text-white border-2 border-bento-card text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Location Selector (Strictly below navbar on small screens) */}
      <div className="sm:hidden px-4 py-2 border-b border-bento-border bg-bento-bg flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span className="text-xs text-bento-sub font-medium">Serving:</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs font-bold text-bento-text bg-transparent focus:outline-none cursor-pointer"
          >
            {BANGALORE_AREAS.map((area) => (
              <option key={area} value={area}>
                {area} (Bengaluru)
              </option>
            ))}
          </select>
        </div>
        
        <a
          href={AREA_WHATSAPP_LINKS[selectedArea]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-neutral-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shadow-xs active:scale-95 transition-all"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.951 11.43.951c-5.44 0-9.866 4.369-9.87 9.802-.001 1.716.463 3.39 1.34 4.877l-.994 3.634 3.751-.984zm11.083-7.5c-.302-.15-1.786-.881-2.053-.978-.266-.097-.461-.146-.655.15-.194.297-.749.978-.919 1.173-.17.195-.34.219-.642.069-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.082-.175-.3-.019-.462.131-.611.135-.134.302-.35.454-.525.151-.175.202-.299.302-.5.101-.2.051-.375-.025-.526-.076-.15-.655-1.579-.897-2.161-.236-.569-.475-.492-.655-.501-.17-.008-.364-.01-.559-.01-.194 0-.51.073-.777.364-.266.292-1.02 1.025-1.02 2.501 0 1.475 1.07 2.9 1.215 3.1.146.199 2.105 3.214 5.099 4.507.712.308 1.27.493 1.704.631.715.227 1.365.195 1.88.118.574-.085 1.786-.73 2.039-1.436.252-.706.252-1.312.176-1.436-.076-.124-.267-.197-.569-.347z"/>
          </svg>
          <span>Chat Desk</span>
        </a>
      </div>

      <main className="flex-1 pb-16">
        
        {/* Dribbble-inspired Premium Industrial Hero Section */}
        <IndustrialHero
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          onBookClick={() => setIsWhatsFormOpen(true)}
          onExploreClick={() => {
            const el = document.getElementById('services-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectSearch={(query) => {
            setSearchQuery(query);
            const el = document.getElementById('services-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        
        {/* 2. Bento Grid Dashboard spotlight area */}
        <section className="relative px-4 py-8 md:py-12 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            
            {/* Bento Layout Pattern Grid */}
            <motion.div 
              variants={bentoContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-4 gap-5"
            >
              


              {/* Box 2 (Location & Area - Bento Medium) */}
              <motion.div 
                variants={bentoCardVariants}
                className="md:col-span-2 bg-bento-card rounded-[32px] p-6 md:p-8 shadow-sm border border-bento-border flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs text-bento-sub font-bold uppercase tracking-wider">Service Location</h3>
                    <p className="text-lg md:text-xl font-extrabold mt-1 text-bento-text">
                      {selectedArea}, Bengaluru
                    </p>
                    <p className="text-[10px] text-bento-sub mt-0.5">Delivering verified service partners in 45 mins.</p>
                  </div>
                  
                  <a
                    href={AREA_WHATSAPP_LINKS[selectedArea]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-neutral-900 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.951 11.43.951c-5.44 0-9.866 4.369-9.87 9.802-.001 1.716.463 3.39 1.34 4.877l-.994 3.634 3.751-.984zm11.083-7.5c-.302-.15-1.786-.881-2.053-.978-.266-.097-.461-.146-.655.15-.194.297-.749.978-.919 1.173-.17.195-.34.219-.642.069-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.082-.175-.3-.019-.462.131-.611.135-.134.302-.35.454-.525.151-.175.202-.299.302-.5.101-.2.051-.375-.025-.526-.076-.15-.655-1.579-.897-2.161-.236-.569-.475-.492-.655-.501-.17-.008-.364-.01-.559-.01-.194 0-.51.073-.777.364-.266.292-1.02 1.025-1.02 2.501 0 1.475 1.07 2.9 1.215 3.1.146.199 2.105 3.214 5.099 4.507.712.308 1.27.493 1.704.631.715.227 1.365.195 1.88.118.574-.085 1.786-.73 2.039-1.436.252-.706.252-1.312.176-1.436-.076-.124-.267-.197-.569-.347z"/>
                    </svg>
                    <span>WhatsApp {selectedArea} Desk</span>
                  </a>
                </div>
                <div className="relative shrink-0 w-full sm:w-auto">
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="appearance-none w-full sm:w-auto bg-bento-bg text-bento-text hover:bg-neutral-200/40 dark:hover:bg-neutral-850/45 text-xs font-bold py-2.5 px-5 pr-9 rounded-full border border-bento-border outline-none focus:border-bento-blue cursor-pointer transition-colors"
                  >
                    {BANGALORE_AREAS.map((area) => (
                      <option key={area} value={area} className="bg-bento-card text-bento-text">
                        {area}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-bento-sub absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </motion.div>

              {/* Box 3 (Smart Input Prompt Search - Bento Medium) */}
              <motion.div 
                variants={bentoCardVariants}
                className="md:col-span-2 bg-bento-card rounded-[32px] p-6 md:p-8 shadow-sm border border-bento-border flex flex-col justify-center space-y-3 transition-colors"
              >
                <div>
                  <h3 className="text-xs text-bento-sub font-bold uppercase tracking-wider">What device broke?</h3>
                  <p className="text-[10px] text-bento-sub mt-0.5">Type or tap trending shortcuts to quick find.</p>
                </div>
                <div className="relative bg-bento-bg rounded-2xl px-4 py-3 flex items-center gap-2 border border-transparent focus-within:border-bento-blue/35 focus-within:bg-bento-card transition-all">
                  <Search className="w-4 h-4 text-bento-sub shrink-0" />
                  <input
                    type="text"
                    placeholder="Search screens, iPhone, Mac battery, iPad, smartwatch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-bento-text bg-transparent placeholder-neutral-400 focus:outline-none font-bold"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-neutral-455 hover:text-bento-text bg-neutral-200/50 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 items-center pt-1">
                  <span className="text-[9px] text-bento-sub font-extrabold uppercase tracking-widest mr-1">Hot:</span>
                  {['iPhone Screen', 'Mac Battery', 'iPad Digitizer', 'Smartwatch', 'Diagnostics'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all border ${
                        searchQuery.toLowerCase() === tag.toLowerCase()
                          ? 'bg-bento-blue text-white border-bento-blue shadow-xs'
                          : 'bg-bento-bg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-bento-text border-transparent'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Box 4 (Rapid Service shortcut 1 - Bento Small) */}
              <motion.button
                variants={bentoCardVariants}
                onClick={() => {
                  setSelectedCategory('iphone');
                  setSearchQuery('');
                  const el = document.getElementById('services-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-bento-card hover:bg-indigo-500/5 rounded-[32px] p-6 flex flex-col justify-center items-center text-center hover:shadow-md transition-all border border-bento-border cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-550/10 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-bold text-sm text-bento-text">iPhone Repair</span>
                <span className="text-[10px] text-bento-sub mt-0.5">OLED screen &amp; battery solutions</span>
              </motion.button>

              {/* Box 5 (Rapid Service shortcut 2 - Bento Small) */}
              <motion.button
                variants={bentoCardVariants}
                onClick={() => {
                  setSelectedCategory('macbook');
                  setSearchQuery('');
                  const el = document.getElementById('services-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-bento-card hover:bg-[#0071e3]/5 rounded-[32px] p-6 flex flex-col justify-center items-center text-center hover:shadow-md transition-all border border-bento-border cursor-pointer group"
              >
                <div className="w-12 h-12 bg-bento-blue/10 dark:bg-bento-blue/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="w-6 h-6 text-bento-blue" />
                </div>
                <span className="font-bold text-sm text-bento-text">MacBook Repair</span>
                <span className="text-[10px] text-bento-sub mt-0.5">Retina screens &amp; battery service</span>
              </motion.button>

              {/* Box 6 (Safety Warranty - Bento Vertical, tall layout span 2 rows & 2 columns) */}
              <motion.div 
                variants={bentoCardVariants}
                className="bg-neutral-900 dark:bg-[#161617] border border-neutral-800 dark:border-bento-border text-white rounded-[32px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 md:col-span-2 md:row-span-2"
              >
                <div className="absolute top-10 right-10 opacity-10">
                  <Wrench className="w-40 h-40 stroke-[1.5]" />
                </div>
                <div className="z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                    <ShieldCheck className="w-7 h-7 text-bento-blue" />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">Baba Safety Standard</h4>
                  <p className="text-sm text-neutral-400 mt-4 leading-relaxed max-w-md">
                    Verified hardware engineers, ESD-safe lab benches, and an untampered 30-day post-service warranty.
                  </p>
                </div>
                <div className="mt-12 z-10 flex items-center justify-between text-xs text-[#86868b] border-t border-neutral-800 pt-5">
                  <span>Assured visit SLA</span>
                  <span className="font-extrabold text-white text-sm">45-Min Guarantee</span>
                </div>
              </motion.div>

              {/* Box 7 (Loyalty Club Member - Bento Horizontal Narrow, col-span-1) */}
              <motion.div 
                variants={bentoCardVariants}
                className="md:col-span-1 bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-[32px] p-6 text-white flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="z-10">
                  <span className="bg-white/20 text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md">
                    Exclusive Benefit
                  </span>
                  <h3 className="text-lg font-extrabold mt-3 tracking-tight">Express Repair Club</h3>
                  <p className="opacity-85 text-[10px] mt-2 leading-relaxed">
                    Join owners. Unlock <span className="font-bold text-yellow-300">priority express scheduling &amp; lead expert</span> assignments.
                  </p>
                </div>
                <div className="shrink-0 z-10 mt-5">
                  <button
                    onClick={() => setIsPlusMember(!isPlusMember)}
                    className={`w-full py-2.5 px-4 rounded-full font-bold text-[10px] tracking-tight shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer ${
                      isPlusMember
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-indigo-700 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-indigo-400 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {isPlusMember ? 'Express Club Active ✓' : 'Join Express Club'}
                  </button>
                </div>
                <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full filter blur-2xl"></div>
              </motion.div>

              {/* Box 8 (Instant Diagnostician Live Agent - Bento Small) */}
              <motion.button
                variants={bentoCardVariants}
                onClick={() => setIsAiOpen(true)}
                className="bg-bento-card hover:bg-bento-bg/80 rounded-[32px] p-6 flex items-center gap-4 transition-all text-left cursor-pointer group border border-bento-border shadow-xs"
              >
                <div className="w-11 h-11 bg-bento-bg rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-bento-blue fill-blue-50/10" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-bento-text">Live Support</h4>
                  <p className="text-[10px] text-bento-sub mt-0.5 leading-tight">Expert AI helps diagnose instantly &lt; 2m</p>
                </div>
              </motion.button>

              {/* Box 9 (Verified Ratings statistics card - Bento Wide, col-span-4) */}
              <motion.div 
                variants={bentoCardVariants}
                className="md:col-span-4 bg-bento-card rounded-[32px] p-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-bento-border shadow-sm transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black tracking-tight text-bento-text">4.8/5</span>
                  <div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-bento-sub text-[10px] font-bold tracking-wide uppercase mt-1">Overall Customer Rating</p>
                  </div>
                </div>
                <span className="text-bento-sub text-xs font-bold tracking-wider uppercase">2.4M Verified Ratings Across India</span>
              </motion.div>

            </motion.div>

          </div>
        </section>

        {/* 3. SIMULATED LIVE TRACKING TIMELINE DISPLAY (Shows only if booking is active!) */}

        {/* 3. SIMULATED LIVE TRACKING TIMELINE DISPLAY (Shows only if booking is active!) */}
        <AnimatePresence>
          {activeBookings.length > 0 && (
            <section className="px-4 pb-12">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 15 }}
                  className="bg-neutral-900 text-white rounded-2xl overflow-hidden border border-neutral-800 shadow-xl"
                >
                  {/* Status Banner */}
                  <div className="p-5 md:p-6 bg-neutral-950 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-[9px] uppercase font-extrabold tracking-widest bg-amber-500 rounded text-neutral-950 animate-pulse">
                          Live Tracker
                        </span>
                        <span className="text-xs text-neutral-400 font-bold">
                          Booking ID: {activeBookings[0].id}
                        </span>
                      </div>
                      <h3 className="text-base font-bold font-display text-neutral-100 mt-1.5">
                        Your physical technician is being coordinated
                      </h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Slot: {activeBookings[0].dateSlot} • {activeBookings[0].timeSlot}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Clean simulation array
                          setActiveBookings([]);
                        }}
                        className="px-3.5 py-1.5 bg-neutral-800 hover:bg-red-950 hover:text-red-300 text-neutral-300 rounded-xl text-xs font-semibold tracking-tight transition-all"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>

                  {/* Progressive Timeline Bar */}
                  <div className="p-6 border-b border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-neutral-400 tracking-wider mb-4">
                      <span>Service Timeline Progress</span>
                      <span className="text-amber-400">
                        Status: {activeBookings[0].status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-center">
                      {[
                        { label: 'Confirmed', step: 1 },
                        { label: 'Assigned', step: 2 },
                        { label: 'Arriving', step: 3 },
                        { label: 'In Progress', step: 4 },
                        { label: 'Completed', step: 5 }
                      ].map((item, idx) => {
                        const currentStep = getStatusStep(activeBookings[0].status);
                        const isDone = currentStep >= item.step;
                        return (
                          <div key={idx} className="space-y-2">
                            <div className={`h-1.5 rounded-full transition-all duration-750 ${
                              isDone ? 'bg-amber-500' : 'bg-neutral-800'
                            }`} />
                            <p className={`text-[9px] font-bold tracking-tight leading-tight hidden md:block ${
                              isDone ? 'text-neutral-150 font-extrabold' : 'text-neutral-500'
                            }`}>
                              {item.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Partner Details Card if assigned */}
                  {activeBookings[0].partner ? (
                    <div className="p-6 bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={activeBookings[0].partner.photo}
                          alt={activeBookings[0].partner.name}
                          className="w-12 h-12 rounded-full object-cover border border-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-neutral-100">{activeBookings[0].partner.name}</h4>
                            <span className="flex items-center text-[10px] bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded font-extrabold">
                              ★ {activeBookings[0].partner.rating}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-450 mt-0.5">
                            Verified Tech Partner Assigned ({activeBookings[0].partner.vehicleNumber})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={`tel:${activeBookings[0].partner.contact}`}
                          className="p-3 bg-neutral-800 hover:bg-neutral-750 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                          title="Call Partner"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        {AREA_WHATSAPP_LINKS[activeBookings[0].address.area] && (
                          <a
                            href={AREA_WHATSAPP_LINKS[activeBookings[0].address.area]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                            title={`WhatsApp ${activeBookings[0].address.area} Desk`}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.951 11.43.951c-5.44 0-9.866 4.369-9.87 9.802-.001 1.716.463 3.39 1.34 4.877l-.994 3.634 3.751-.984zm11.083-7.5c-.302-.15-1.786-.881-2.053-.978-.266-.097-.461-.146-.655.15-.194.297-.749.978-.919 1.173-.17.195-.34.219-.642.069-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.082-.175-.3-.019-.462.131-.611.135-.134.302-.35.454-.525.151-.175.202-.299.302-.5.101-.2.051-.375-.025-.526-.076-.15-.655-1.579-.897-2.161-.236-.569-.475-.492-.655-.501-.17-.008-.364-.01-.559-.01-.194 0-.51.073-.777.364-.266.292-1.02 1.025-1.02 2.501 0 1.475 1.07 2.9 1.215 3.1.146.199 2.105 3.214 5.099 4.507.712.308 1.27.493 1.704.631.715.227 1.365.195 1.88.118.574-.085 1.786-.73 2.039-1.436.252-.706.252-1.312.176-1.436-.076-.124-.267-.197-.569-.347z"/>
                            </svg>
                          </a>
                        )}
                        <div className="text-right text-[10px] text-neutral-400">
                          <p className="font-semibold text-neutral-200">Arriving on schedule</p>
                          <p className="mt-0.5 text-[9px] text-neutral-500">Contact verified</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-neutral-400 space-y-4">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <div>
                        <p className="font-semibold">Searching nearest premium partner in {activeBookings[0].address.area}...</p>
                        <p className="text-[10px] text-neutral-500">Usually coordinates within 30 seconds.</p>
                      </div>
                      
                      {AREA_WHATSAPP_LINKS[activeBookings[0].address.area] && (
                        <div className="pt-2">
                          <a
                            href={AREA_WHATSAPP_LINKS[activeBookings[0].address.area]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-neutral-900 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.951 11.43.951c-5.44 0-9.866 4.369-9.87 9.802-.001 1.716.463 3.39 1.34 4.877l-.994 3.634 3.751-.984zm11.083-7.5c-.302-.15-1.786-.881-2.053-.978-.266-.097-.461-.146-.655.15-.194.297-.749.978-.919 1.173-.17.195-.34.219-.642.069-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.082-.175-.3-.019-.462.131-.611.135-.134.302-.35.454-.525.151-.175.202-.299.302-.5.101-.2.051-.375-.025-.526-.076-.15-.655-1.579-.897-2.161-.236-.569-.475-.492-.655-.501-.17-.008-.364-.01-.559-.01-.194 0-.51.073-.777.364-.266.292-1.02 1.025-1.02 2.501 0 1.475 1.07 2.9 1.215 3.1.146.199 2.105 3.214 5.099 4.507.712.308 1.27.493 1.704.631.715.227 1.365.195 1.88.118.574-.085 1.786-.73 2.039-1.436.252-.706.252-1.312.176-1.436-.076-.124-.267-.197-.569-.347z"/>
                            </svg>
                            <span>Chat with {activeBookings[0].address.area} Desk</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* List of checked out items */}
                  <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800/80 text-xs text-neutral-400 flex flex-wrap justify-between gap-2.5">
                    <span className="font-semibold">Items Booked: {activeBookings[0].items.map((i) => i.service.name).join(', ')}</span>
                    <span className="font-bold text-amber-400">Locked Quote Estimate: Pending Diagnostics</span>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* 4. Category Grid Navigation Segment */}
        <section id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-8 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-bento-border pb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-sans text-bento-text tracking-tight">
                  Our Curated Repair Services
                </h2>
                <p className="text-xs text-bento-sub mt-1">
                  Select a category to view instant flat-rate repair catalog cards.
                </p>
              </div>
              <button
                onClick={() => setIsWhatsFormOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm hover:shadow-md self-start sm:self-center"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse text-amber-300" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Apple style pill filter */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer select-none shrink-0 border ${
                    selectedCategory === cat.id
                      ? 'bg-bento-blue text-white border-bento-blue shadow-sm hover:bg-bento-blue-hover'
                      : 'bg-bento-card hover:bg-bento-bg text-bento-text border-bento-border'
                  }`}
                >
                  {renderCategoryIcon(cat.icon)}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Services Listing Cards Grid (Bento style dynamic cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, idx) => {
                const isInCart = !!cart.find((item) => item.service.id === service.id);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: Math.min((idx % 3) * 0.06, 0.25)
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={service.id}
                    className="group bg-bento-card rounded-[32px] border border-bento-border overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-350"
                  >
                    {/* Card Cover image */}
                    <div
                      onClick={() => setSelectedDetailService(service)}
                      className="relative h-48 bg-bento-bg cursor-pointer overflow-hidden"
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-bento-text/5 group-hover:bg-transparent transition-colors" />
                      
                      {/* Rating block floating */}
                      <div className="absolute top-3 left-3 bg-bento-card/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-bento-text flex items-center gap-1 shadow-sm transition-colors">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{service.rating}</span>
                      </div>

                      {/* Fastest Delivery badge for high review ratings (>= 4.8) */}
                      {service.rating >= 4.8 && (
                        <div className="absolute top-3 right-3 bg-emerald-500/95 dark:bg-emerald-600/95 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[9px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                          <span>Fastest Delivery</span>
                        </div>
                      )}

                      {/* Promo label floating */}
                      <div className="absolute bottom-3 left-3 bg-emerald-500/95 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                        Free Diagnostics
                      </div>
                    </div>

                    {/* Card Copy block */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-bento-blue">
                            {service.category}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-bento-sub font-bold">
                            <Clock className="w-3" />
                            <span>{service.duration}</span>
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-bento-text group-hover:text-bento-blue transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-[11px] text-bento-sub font-medium leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Micro list features inclusions */}
                      <div className="bg-bento-bg p-3 rounded-2xl border border-bento-border/60 space-y-1.5 text-left">
                        {service.features.slice(0, 2).map((feat, fIdx) => (
                          <div key={fIdx} className="flex gap-2 items-start text-[10px] text-bento-text/80 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price tag & add actions */}
                      <div className="flow-root pt-3 border-t border-bento-border/70">
                        <div className="flex items-baseline gap-1.5 float-left select-none">
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Free Visit
                          </span>
                        </div>

                        {/* Direct booking button toggle */}
                        <div className="float-right flex gap-1.5">
                          <button
                            onClick={() => setSelectedDetailService(service)}
                            className="px-3.5 py-1.5 text-[10px] text-bento-text bg-bento-bg hover:bg-neutral-200/55 dark:hover:bg-neutral-800/55 font-bold rounded-full transition-all cursor-pointer"
                          >
                            Details
                          </button>
                          <a
                            href={`${AREA_WHATSAPP_LINKS[selectedArea] || 'https://wa.me/+919535377862'}?text=${encodeURIComponent(`Hi FixerBaba, I would like to get a quote/book a repair for ${service.name} in ${selectedArea}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 text-[10px] font-bold rounded-full transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center cursor-pointer"
                          >
                            Contact
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredServices.length === 0 && (
            <div className="p-12 text-center bg-bento-card rounded-[32px] border border-bento-border mt-8 space-y-2">
              <span className="block text-2xl">🔍</span>
              <p className="text-sm font-bold text-bento-text">No matching services found.</p>
              <p className="text-xs text-bento-sub font-semibold">Try searching for generic terms like "AC", "leak", or "carpet".</p>
            </div>
          )}
        </section>

        {/* 5.5 Get a Quote Section with Book Appointment Link */}
        <section id="get-quote-section" className="max-w-7xl mx-auto px-4 sm:px-8 mt-24">
          <div className="bg-gradient-to-br from-amber-500/5 via-bento-blue/5 to-transparent border border-bento-border rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            {/* Background ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-bento-blue/10 rounded-full filter blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full tracking-wider">
                  <Sparkles className="w-3 h-3 fill-current animate-pulse" /> Custom Estimator Lab
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-bento-text font-sans">
                  Need a custom repair quote? <br />
                  <span className="text-bento-blue">Get it in minutes over WhatsApp.</span>
                </h2>
                <p className="text-xs sm:text-sm text-bento-sub font-semibold leading-relaxed max-w-xl">
                  Can't find your specific service or device listed? Don't worry. Our engineering lab is ready to review your custom requirements. Describe the issue, attach images, and get a precise, contract-locked quote with ₹0 visiting fee.
                </p>
                
                {/* Visual workflow markers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex gap-3 items-start bg-bento-bg/60 p-4 rounded-2xl border border-bento-border/70">
                    <span className="text-xs font-black text-bento-blue bg-bento-blue/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="text-[11px] font-extrabold text-bento-text uppercase tracking-tight">Submit Request</h4>
                      <p className="text-[10px] text-bento-sub font-semibold mt-0.5">Tell us what needs fixing</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start bg-bento-bg/60 p-4 rounded-2xl border border-bento-border/70">
                    <span className="text-xs font-black text-amber-500 bg-amber-500/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="text-[11px] font-extrabold text-bento-text uppercase tracking-tight">Lab Review</h4>
                      <p className="text-[10px] text-bento-sub font-semibold mt-0.5">Experts analyze device symptoms</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start bg-bento-bg/60 p-4 rounded-2xl border border-bento-border/70">
                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="text-[11px] font-extrabold text-bento-text uppercase tracking-tight">Direct Estimate</h4>
                      <p className="text-[10px] text-bento-sub font-semibold mt-0.5">Locked price quote sent to you</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call-to-action cards/button block */}
              <div className="lg:w-80 shrink-0 bg-bento-card border border-bento-border p-6 rounded-3xl shadow-sm space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-bento-text uppercase tracking-tight">Zero Obligation Booking</h3>
                  <p className="text-[11px] text-bento-sub font-semibold leading-relaxed">
                    Schedule a free home diagnostic visit. Deny or accept estimates with no penalty.
                  </p>
                </div>
                
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setIsWhatsFormOpen(true)}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-neutral-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
                  >
                    <span className="font-black">Book Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] text-bento-sub text-center font-bold uppercase tracking-widest">
                    ⚡ Instant WhatsApp Confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Apple-style Bento highlight highlights */}
        <section className="bg-neutral-900 border border-neutral-850 dark:bg-[#161617] dark:border-bento-border text-white py-16 md:py-20 mt-24 rounded-[40px] max-w-7xl mx-auto px-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-xl mb-12">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-bento-blue rounded-full text-white tracking-wider">
                Why FixerBaba
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-sans mt-4 tracking-tight leading-tight">
                Redesigning home repairs for the 21st century.
              </h2>
              <p className="text-xs text-bento-sub mt-2 font-medium">
                Say goodbye to random visiting quotes, unqualified technicians, and follow-up delays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 space-y-4 hover:bg-white/7 transition-all duration-300">
                <div className="w-11 h-11 bg-bento-blue/20 text-bento-blue rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">30-Day Guarantee Cover</h3>
                <p className="text-xs text-[#86868b] leading-relaxed font-semibold">
                  We stand by the quality of our skills. If a defect recurs on your serviced component within 30 days, we repair it free of cost immediately.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 space-y-4 hover:bg-white/7 transition-all duration-300">
                <div className="w-11 h-11 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Certified Tech Academy</h3>
                <p className="text-xs text-[#86868b] leading-relaxed font-semibold">
                  Every FixerBaba repair partner undergoes criminal check background verifications, biometric authentication, and a rigorous 15-day technical exam.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 space-y-4 hover:bg-white/7 transition-all duration-300">
                <div className="w-11 h-11 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">No Hidden Charges</h3>
                <p className="text-xs text-[#86868b] leading-relaxed font-semibold">
                  We offer absolute upfront transparency. Get fully-specified diagnostic quote estimates locked before your repair begins with zero surcharge surprises.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 7. Beautiful Customer Reviews Carousel block */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-left space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#4285F4] bg-[#4285F4]/10 dark:bg-[#4285F4]/20 px-3 py-1 rounded-full transition-colors border border-[#4285F4]/10">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.461 0-6.267-2.806-6.267-6.267 0-3.461 2.806-6.267 6.267-6.267 1.49 0 2.85.523 3.924 1.39l2.977-2.977C18.91 1.777 15.748.81 12.24.81 6.012.81 1 5.82 1 12.048S6.012 23.285 12.24 23.285c5.748 0 10.743-4.084 10.743-11.237 0-.706-.08-1.21-.194-1.763H12.24z"/>
                </svg>
                <span>Google Verified Reviews</span>
              </span>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-bento-text tracking-tight">
                  Loved by 50,000+ Bengalureans
                </h2>
                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => scrollReviews('left')}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-bento-border bg-bento-card hover:bg-neutral-200/40 dark:hover:bg-neutral-850/45 flex items-center justify-center text-bento-text transition-colors cursor-pointer"
                    aria-label="Previous reviews"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => scrollReviews('right')}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-bento-border bg-bento-card hover:bg-neutral-200/40 dark:hover:bg-neutral-850/45 flex items-center justify-center text-bento-text transition-colors cursor-pointer"
                    aria-label="Next reviews"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-bento-sub font-semibold max-w-xl">
                Read authentic Google reviews from real device owners across Koramangala, Marathahalli, and HBR Layout.
              </p>
            </div>

            {/* Google Rating Stats Callout */}
            <div className="flex items-center gap-4 p-4 bg-bento-card border border-bento-border rounded-2xl shadow-xs self-start md:self-end">
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-bento-text">4.9</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-bento-sub font-bold mt-0.5">Based on 1,420+ live Google Maps ratings</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                >
                  <span>Write a Review</span>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </button>

                <a
                  href="https://maps.app.goo.gl/PxnXXB5kVn8vowLB7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-[#4285F4] hover:bg-[#3574de] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <span>View on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div 
            ref={reviewsContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
          >
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] p-8 bg-bento-card border border-bento-border rounded-[32px] shadow-xs hover:shadow-md transition-all duration-350 flex flex-col justify-between space-y-5 text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Stars block */}
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>

                    {/* Google Source Indicator */}
                    <span className="flex items-center gap-1 text-[9px] font-black text-[#4285F4] bg-[#4285F4]/5 px-2 py-0.5 rounded-md border border-[#4285F4]/10">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.461 0-6.267-2.806-6.267-6.267 0-3.461 2.806-6.267 6.267-6.267 1.49 0 2.85.523 3.924 1.39l2.977-2.977C18.91 1.777 15.748.81 12.24.81 6.012.81 1 5.82 1 12.048S6.012 23.285 12.24 23.285c5.748 0 10.743-4.084 10.743-11.237 0-.706-.08-1.21-.194-1.763H12.24z"/>
                      </svg>
                      <span>Google Map Verified</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-bento-text/90 italic leading-relaxed">
                    "{rev.text}"
                  </p>

                  {rev.image && (
                    <div className="mt-3 relative rounded-2xl overflow-hidden border border-bento-border/50 aspect-video bg-neutral-900/40">
                      <img
                        src={rev.image}
                        alt="Verified customer review proof"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[8px] font-black uppercase bg-black/70 backdrop-blur-md text-white rounded-md tracking-wider border border-white/10">
                        Review Photo
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-bento-border/60 text-[11px] text-bento-sub">
                  <div>
                    <p className="font-extrabold text-bento-text">{rev.userName}</p>
                    <p className="text-[9px] text-[#86868b] font-bold">Serviced: {rev.serviceName}</p>
                  </div>
                  <span className="font-bold text-neutral-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7.2 Live Repair Bench Proof of Work */}
        <section id="live-repair-bench" className="max-w-7xl mx-auto px-4 sm:px-8 mt-24">
          <LiveRepairBench />
        </section>

        {/* 7.5. About Our Team section */}
        <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-8 mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span id="about-badge" className="text-[10px] font-extrabold uppercase tracking-widest text-bento-text bg-bento-bg px-3 py-1 rounded-full transition-colors">
              About Our Company &amp; Team
            </span>
            <h2 id="about-heading" className="text-2xl md:text-3xl font-extrabold text-bento-text tracking-tight mt-4">
              Real Experts. No Middlemen.
            </h2>
            <p id="about-subheading" className="text-xs text-bento-sub mt-1.5 font-semibold">
              Meet our fully licensed, background-checked, and manufacturer-certified tech crew.
            </p>
          </div>

          <div id="about-card" className="bg-bento-card rounded-[40px] border border-bento-border overflow-hidden transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image Column */}
              <div id="about-image-column" className="lg:col-span-7 relative h-[360px] md:h-[480px] w-full overflow-hidden bg-neutral-900 group">
                <img
                  id="about-team-image"
                  src={teamImgSrc}
                  alt="FixerBaba Professional Team"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (teamImgIndex < TEAM_IMAGE_SOURCES.length - 1) {
                      const nextIdx = teamImgIndex + 1;
                      setTeamImgIndex(nextIdx);
                      setTeamImgSrc(TEAM_IMAGE_SOURCES[nextIdx]);
                    }
                  }}
                />
                {/* Dark Gradient Overlay modeled on the user's uploaded layout */}
                <div id="about-image-overlay" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                
                {/* Styled Meet Our Team Text Overlay matching the user's attachment */}
                <div id="about-text-overlay" className="absolute bottom-8 left-0 right-0 text-center select-none space-y-1 px-6">
                  <h3 id="about-overlay-title" className="text-2xl md:text-4xl font-extrabold tracking-widest text-white font-display drop-shadow-md">
                    MEET OUR TEAM
                  </h3>
                  <p id="about-overlay-subtitle" className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase drop-shadow">
                    THE HEART OF BUSINESS
                  </p>
                </div>

                {/* Helpful Instruction Tip displayed when falling back to Unsplash */}
                {teamImgSrc.startsWith('https://') && (
                  <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-white/95 px-3 py-2.5 rounded-xl flex items-center gap-2 shadow-lg leading-snug">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0" />
                    <span>
                      <strong>Found your Team Photo!</strong> To load it inside this preview frame, simply drag and drop your photo into the sidebar file explorer and rename it to <strong><code>team.jpg</code></strong>. The app will swap it instantly!
                    </span>
                  </div>
                )}
              </div>

              {/* Informational Column */}
              <div id="about-info-column" className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center space-y-8 text-left">
                <div className="space-y-3">
                  <div id="about-info-badge" className="inline-flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                    <Award className="w-4 h-4" />
                    <span>Quality First Commitment</span>
                  </div>
                  <h4 id="about-info-title" className="text-lg md:text-xl font-bold text-bento-text">
                    Bringing Elite Technology Expertise Direct To Your Desk
                  </h4>
                  <p id="about-info-desc" className="text-xs text-bento-sub leading-relaxed font-semibold">
                    At FixerBaba, we believe that luxury gadgets deserve expert-grade diagnostics. We have eliminated local middlemen and unreliable neighborhood repair agents to build a high-performance logistics grid backboned by certified in-house hardware technicians.
                  </p>
                </div>

                {/* 3-column feature grid below description area */}
                <div id="about-features-grid" className="grid grid-cols-3 gap-4 border-t border-bento-border/70 pt-6">
                  <motion.div
                    animate={{
                      x: tiltCard1.x,
                      y: tiltCard1.y,
                      rotateX: tiltCard1.rotateX,
                      rotateY: tiltCard1.rotateY,
                      scale: tiltCard1.active ? 1.025 : 1,
                      boxShadow: tiltCard1.active
                        ? isDarkMode
                          ? '0 20px 40px rgba(16, 185, 129, 0.22), 0 0 15px rgba(16, 185, 129, 0.1)'
                          : '0 20px 40px rgba(16, 185, 129, 0.15)'
                        : '0 0px 0px rgba(0, 0, 0, 0)',
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 220, mass: 0.5 }}
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    onMouseMove={(e) => handleCardMouseMove(e, setTiltCard1)}
                    onMouseLeave={() => handleCardMouseLeave(setTiltCard1)}
                    className="group space-y-3 p-2.5 rounded-2xl border border-transparent bg-transparent hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300 cursor-default"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90 select-none pointer-events-none" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-emerald-500/10 dark:stroke-emerald-500/5"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-emerald-500/70 dark:stroke-emerald-500/60 transition-all duration-1000 ease-out group-hover:stroke-emerald-400 group-hover:animate-pulse"
                          strokeWidth="2.5"
                          strokeDasharray="95,100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full scale-75 select-none z-20 shadow-sm leading-none">95%</span>
                      <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full group-hover:scale-105 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30 transition-all duration-300">
                        <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-extrabold text-bento-text tracking-tight uppercase group-hover:text-emerald-500 transition-colors duration-300">Sustainability</h5>
                      <p className="text-[10px] text-bento-sub font-semibold mt-1 leading-relaxed">
                        Eco-friendly circular diagnostics &amp; e-waste mitigation.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      x: tiltCard2.x,
                      y: tiltCard2.y,
                      rotateX: tiltCard2.rotateX,
                      rotateY: tiltCard2.rotateY,
                      scale: tiltCard2.active ? 1.025 : 1,
                      boxShadow: tiltCard2.active
                        ? isDarkMode
                          ? '0 20px 40px rgba(59, 130, 246, 0.22), 0 0 15px rgba(59, 130, 246, 0.1)'
                          : '0 20px 40px rgba(59, 130, 246, 0.15)'
                        : '0 0px 0px rgba(0, 0, 0, 0)',
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 220, mass: 0.5 }}
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    onMouseMove={(e) => handleCardMouseMove(e, setTiltCard2)}
                    onMouseLeave={() => handleCardMouseLeave(setTiltCard2)}
                    className="group space-y-3 p-2.5 rounded-2xl border border-transparent bg-transparent hover:bg-bento-blue/5 hover:border-bento-blue/20 transition-all duration-300 cursor-default"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90 select-none pointer-events-none" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-bento-blue/10 dark:stroke-bento-blue/5"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-bento-blue/70 dark:stroke-bento-blue/60 transition-all duration-1000 ease-out group-hover:stroke-bento-blue group-hover:animate-pulse"
                          strokeWidth="2.5"
                          strokeDasharray="99,100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-bento-blue text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full scale-75 select-none z-20 shadow-sm leading-none">99%</span>
                      <div className="p-2 bg-bento-blue/10 dark:bg-bento-blue/20 text-bento-blue rounded-full group-hover:scale-105 group-hover:bg-bento-blue/20 dark:group-hover:bg-bento-blue/30 transition-all duration-300">
                        <Clock className="w-3.5 h-3.5 text-bento-blue" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-extrabold text-bento-text tracking-tight uppercase group-hover:text-bento-blue transition-colors duration-300">24/7 Support</h5>
                      <p className="text-[10px] text-bento-sub font-semibold mt-1 leading-relaxed">
                        Round-the-clock priority WhatsApp team coordinates.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      x: tiltCard3.x,
                      y: tiltCard3.y,
                      rotateX: tiltCard3.rotateX,
                      rotateY: tiltCard3.rotateY,
                      scale: tiltCard3.active ? 1.025 : 1,
                      boxShadow: tiltCard3.active
                        ? isDarkMode
                          ? '0 20px 40px rgba(245, 158, 11, 0.22), 0 0 15px rgba(245, 158, 11, 0.1)'
                          : '0 20px 40px rgba(245, 158, 11, 0.15)'
                        : '0 0px 0px rgba(0, 0, 0, 0)',
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 220, mass: 0.5 }}
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    onMouseMove={(e) => handleCardMouseMove(e, setTiltCard3)}
                    onMouseLeave={() => handleCardMouseLeave(setTiltCard3)}
                    className="group space-y-3 p-2.5 rounded-2xl border border-transparent bg-transparent hover:bg-amber-500/5 hover:border-amber-500/20 transition-all duration-300 cursor-default"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90 select-none pointer-events-none" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-amber-500/10 dark:stroke-amber-500/5"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-amber-500/70 dark:stroke-amber-500/60 transition-all duration-1000 ease-out group-hover:stroke-amber-400 group-hover:animate-pulse"
                          strokeWidth="2.5"
                          strokeDasharray="100,100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full scale-75 select-none z-20 shadow-sm leading-none">100%</span>
                      <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-full group-hover:scale-105 group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30 transition-all duration-300">
                        <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-extrabold text-bento-text tracking-tight uppercase group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300">Verified Bench</h5>
                      <p className="text-[10px] text-bento-sub font-semibold mt-1 leading-relaxed">
                        ESD-safe microfiber precision microprocessor lab environment.
                      </p>
                    </div>
                  </motion.div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 8. Frequently Asked Questions Minimal accordion */}
        <section className="max-w-3xl mx-auto px-4 sm:px-8 mt-24 pb-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1.5 text-bento-blue">
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs tracking-wider uppercase font-black text-bento-sub">
                FAQ Center
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-bento-text mt-3">
              Have questions? We have answers.
            </h2>
          </div>

          <div className="divide-y divide-bento-border bg-bento-card p-6 rounded-[32px] border border-bento-border space-y-1 shadow-sm text-left transition-colors">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaqIndex === idx;
              return (
                <div key={idx} className="pb-4 pt-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className="w-full flex justify-between items-center text-left text-xs sm:text-sm font-bold text-bento-text py-1.5 cursor-pointer select-none focus:outline-none"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-bento-sub shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-bento-sub shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[11px] sm:text-xs text-bento-sub leading-relaxed font-semibold pt-2.5 pl-0.5">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 9. Minimalist Clean Footer */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-900 pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <BrandLogo size="md" />
              <p className="text-[11px] text-neutral-400 max-w-sm font-medium">
                Redesigning municipal home service logistics with technology and absolute price transparency in Bengaluru.
              </p>
            </div>

            {/* Social credentials */}
            <div className="flex items-center gap-4 text-xs text-neutral-400 font-bold shrink-0">
              <span className="text-amber-500">● 100% Secure Checkout</span>
              <span>•</span>
              <span>● Certified Technicians</span>
              <span>•</span>
              <span>● 30-Day Guarantee</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-neutral-900 pt-8 gap-4 text-[10px] text-neutral-500 font-medium">
            <p>© {new Date().getFullYear()} FixerBaba. All rights reserved. Managed in Bengaluru, Karnataka.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Operations</a>
              <a href="#" className="hover:text-white transition-colors">SLA Warranties</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. Floating Sticky Cart Summary Trigger */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-neutral-950 text-white py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-xl hover:bg-neutral-900 border border-neutral-800 font-bold text-xs tracking-wide hover:scale-101 active:scale-98 transition-all"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{cartItemsCount} selection{cartItemsCount > 1 ? 's' : ''} in list</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-extrabold font-display">
              Get Quote Estimate <ArrowRight className="w-4 h-4 ml-0.5" />
            </span>
          </button>
        </div>
      )}

      {/* Drawers / Modals */}
      <ServiceDetailDrawer
        service={selectedDetailService}
        isOpen={selectedDetailService !== null}
        onClose={() => setSelectedDetailService(null)}
        onAddToCart={handleAddToCart}
        isInCart={selectedDetailService ? !!cart.find((item) => item.service.id === selectedDetailService.id) : false}
        whatsappUrl={selectedDetailService ? `${AREA_WHATSAPP_LINKS[selectedArea] || 'https://wa.me/+919535377862'}?text=${encodeURIComponent(`Hi FixerBaba, I would like to get a quote/book a repair for ${selectedDetailService.name} in ${selectedArea}.`)}` : undefined}
      />

      <CheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onClearCart={() => setCart([])}
        onPlaceBooking={async (booking) => {
          try {
            await saveBookingToFirestore(booking);
          } catch (err) {
            console.error('Failed to save booking to Firestore:', err);
          }
          // Add booking to the simulation tracker
          setActiveBookings([booking]);
          
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AIAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onAddServiceById={handleAddServiceById}
        servicesInventory={SERVICES_INVENTORY}
      />

      <WhatsFormModal
        isOpen={isWhatsFormOpen}
        onClose={() => setIsWhatsFormOpen(false)}
      />

      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={async (newRev) => {
          const added = await addReviewToFirestore(newRev);
          setReviews((prev) => [added, ...prev]);
        }}
      />
    </div>
  );
}
