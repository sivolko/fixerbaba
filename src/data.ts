import { ServiceItem } from './types';

export const BANGALORE_AREAS = [
  'Koramangala',
  'Marathahalli',
  'HBR Layout'
];

export const AREA_WHATSAPP_LINKS: Record<string, string> = {
  'Koramangala': 'https://wa.me/+919535377862',
  'Marathahalli': 'https://wa.me/+919148666828',
  'HBR Layout': 'https://wa.me/+919380222943',
};

export const SERVICE_CATEGORIES = [
  { id: 'all', name: 'All Repairs', icon: 'Sparkles' },
  { id: 'iphone', name: 'iPhone Repair', icon: 'Smartphone' },
  { id: 'smartphone', name: 'Smartphones', icon: 'Smartphone' },
  { id: 'macbook', name: 'MacBook Care', icon: 'Laptop' },
  { id: 'ipad', name: 'iPad Repair', icon: 'Tablet' },
  { id: 'smartwatch', name: 'Smartwatches', icon: 'Watch' }
];

export const SERVICES_INVENTORY: ServiceItem[] = [
  {
    id: 'iphone-glass-only',
    name: 'iPhone Screen Glass Only Replacement',
    description: 'Don\'t change the whole display! Save 50-70% cost by replacing only the cracked outer glass panel. This eco-friendly process preserves your premium original OLED panel and smooth touch sensitivity.',
    category: 'iphone',
    price: 1499,
    originalPrice: 3999,
    duration: '30 mins',
    rating: 4.9,
    reviewsCount: 1840,
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=600',
    features: [
      'Original OLED panel & touch matrix fully preserved',
      'Save 50-70% compared to a complete screen display change',
      'Advanced Liquid-Optically Clear Adhesive (LOCA) UV curing',
      'Completed in 30 minutes with crystal clear clarity & warranty'
    ]
  },
  {
    id: 'iphone-back-glass-laser',
    name: 'iPhone Back Glass Laser Replacement',
    description: 'Laser-assisted high-precision back glass restoration. Smashed glass is removed cleanly without heating or chassis warping, maintaining wireless charging compatibility.',
    category: 'iphone',
    price: 1999,
    originalPrice: 3499,
    duration: '30 mins',
    rating: 4.9,
    reviewsCount: 920,
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=600',
    features: [
      'Advanced computer-guided Laser precision technology',
      'No thermal heat stress to battery or internal boards',
      'Flawless premium finish matching original look and feel',
      '6-Month comprehensive material and bond warranty'
    ]
  },
  {
    id: 'iphone-logic-board-cpu',
    name: 'iPhone Logic Board & CPU Swapping',
    description: 'We bring dead iPhones back to life! Expert-grade SMD micro-soldering, CPU reballing, and PMIC power controller repair with 100% user data protection.',
    category: 'iphone',
    price: 3999,
    originalPrice: 7999,
    duration: '120 mins',
    rating: 4.8,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600',
    features: [
      'Microscopic advanced board troubleshooting & diagnostics',
      'Complete CPU & motherboard swapping with precision tools',
      '100% user data and software state protection',
      'Premium original IC controller and power chips'
    ]
  },
  {
    id: 'macbook-logic-board',
    name: 'Dead MacBook Logic Board Repair',
    description: 'We bring dead MacBooks back to life! From screen replacement to logic board component repair, we handle every power, charging, and liquid-damage issue with expert care.',
    category: 'macbook',
    price: 5999,
    originalPrice: 12000,
    duration: '180 mins',
    rating: 4.9,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600',
    features: [
      '30 Days Service Warranty & Satisfaction Guaranteed',
      'Component-level micro-soldering, trackpad repair & screen swap',
      'Expert cleanout of liquid residue and logic board corrosion',
      'Full physical estimate with zero diagnostic charge'
    ]
  },
  {
    id: 'apple-accessories-pack',
    name: 'Apple Genuine Accessories Store',
    description: '100% original, Apple-certified genuine accessories: premium USB-C power adapters, lightning charging cables, EarPods with digital audio, and impact-resistant protective cases.',
    category: 'iphone',
    price: 999,
    originalPrice: 1900,
    duration: '15 mins',
    rating: 4.9,
    reviewsCount: 1150,
    image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600',
    features: [
      '100% original verified authentic accessories',
      'MFi Apple certified smart current safety control',
      '6 Months warranty with secure, sealed packaging',
      'Snug fit, high-durability protection & fast performance'
    ]
  },
  {
    id: 'iphone-screen',
    name: 'iPhone Pro Screen Replacement',
    description: 'Genuine OLED display core swap with TrueTone serialization compatibility. Fixes green pixel vertical lines, touch dead spots, and cracked outer glass panels.',
    category: 'iphone',
    price: 3499,
    originalPrice: 4999,
    duration: '45 mins',
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=600',
    features: [
      'High-fidelity OLED original panel transfer',
      'TrueTone & brightness sensor serialization reprogram',
      'Dust, water, and static ESD sealant coating',
      '90-day comprehensive screen functional warranty'
    ]
  },
  {
    id: 'iphone-battery',
    name: 'iPhone Pro Battery Replacement',
    description: 'Restores factory peak cycle capacity and removes the "Service Required" system battery messages. Premium grade-A replacement core cell.',
    category: 'iphone',
    price: 1899,
    originalPrice: 2499,
    duration: '35 mins',
    rating: 4.8,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80&w=600',
    features: [
      'Original safety-certified lithium polymer cell',
      'Transfer of battery controller circuit board',
      'Prevents random hardware throttling thermal issues',
      '30-day comprehensive battery health warranty'
    ]
  },
  {
    id: 'iphone-charge',
    name: 'iPhone Lightning / USB-C Port Fix',
    description: 'Fixes intermittent charging issues, loose connector attachments, or complete lack of power delivery.',
    category: 'iphone',
    price: 1299,
    originalPrice: 1699,
    duration: '40 mins',
    rating: 4.7,
    reviewsCount: 540,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=600',
    features: [
      'Brand new high durability charging dock flex ribbon',
      'Thorough speaker grill micro debris cleanout',
      'USB-C Power Delivery amperage draw testing',
      'Snug cable fit snaps back guarantee'
    ]
  },
  {
    id: 'iphone-camera',
    name: 'iPhone Camera Lens & Sensor Swap',
    description: 'Solves fuzzy auto-focus issues, vibration rattle noise from failing Optical Image Stabilization (OIS), or broken sapphire camera outer glass.',
    category: 'iphone',
    price: 1999,
    originalPrice: 2799,
    duration: '50 mins',
    rating: 4.6,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=600',
    features: [
      'Multi-megapixel camera sensor swap',
      'Premium dustless inner ring gasket sealing',
      'Ultra-clear scratchproof sapphire lens element',
      'Focus accuracy & focal length sensor calibration'
    ]
  },
  {
    id: 'android-screen',
    name: 'Android screen repair & replacement',
    description: 'Premium glass screen replacement for Samsung, OnePlus, Xiaomi, and Pixel. Includes full digitizer calibration.',
    category: 'smartphone',
    price: 2499,
    originalPrice: 3899,
    duration: '50 mins',
    rating: 4.8,
    reviewsCount: 1890,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    features: [
      'In-display ultrasonic optical fingerprint scanner setup',
      'Liquid-Optically Clear Adhesive (LOCA) UV curing process',
      'Premium pre-installed oleophobic screen protector',
      '90-day comprehensive display quality warranty'
    ]
  },
  {
    id: 'android-battery',
    name: 'Android Power Battery Swap',
    description: 'Resolves overheating, random percentage drops, or bloated rear glass shells. Includes safety thermal diagnostics.',
    category: 'smartphone',
    price: 1199,
    originalPrice: 1599,
    duration: '30 mins',
    rating: 4.7,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=600',
    features: [
      'Safety thermistor temperature diagnostic review',
      'High capacity lithium ion polymer cell replacement',
      'Fast charge compatibility power-draw verification',
      'Responsible recycling of compromised worn cells'
    ]
  },
  {
    id: 'macbook-screen',
    name: 'MacBook Retina Display Assembly',
    description: 'Resolves display lines, stage lighting backlight effects, dead vertical columns of pixels, or fractured outer glass overlays.',
    category: 'macbook',
    price: 12999,
    originalPrice: 18999,
    duration: '90 mins',
    rating: 4.9,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600',
    features: [
      'Original spec high-density IPS Retina screen',
      'FaceTime HD camera & ambient light auto calibration',
      'Laser dynamic calibration of screen angle controller',
      '6-month screen defect warranty coverage'
    ]
  },
  {
    id: 'macbook-battery',
    name: 'MacBook Premium Battery Service',
    description: 'Swaps out degraded cells triggering the Apple system battery health warning. Restores laptop battery life to original specs.',
    category: 'macbook',
    price: 4999,
    originalPrice: 6999,
    duration: '60 mins',
    rating: 4.9,
    reviewsCount: 610,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
    features: [
      'Original capacity zero-cycle cell assemblies',
      'Adhesive dissolve processes protecting trackpads',
      'Dual active fan blower cleaning and lint pickup',
      'System Management Controller (SMC) voltage review'
    ]
  },
  {
    id: 'macbook-keyboard',
    name: 'MacBook Key Mechanisms & Trackpad Fix',
    description: 'Saves sticky keyboard dome switches, butterfly elements, non-clicking trackpads, or cracked glass trackpad surfaces.',
    category: 'macbook',
    price: 2999,
    originalPrice: 4200,
    duration: '75 mins',
    rating: 4.7,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600',
    features: [
      'Individual key dome switch mechanism repair',
      'Complete flexible connection ribbon cable swap',
      'ForceTouch electromagnetic haptic test check',
      'Uniform backlight diffusion grid sweep'
    ]
  },
  {
    id: 'ipad-screen',
    name: 'iPad Multi-Touch Digitizer Repair',
    description: 'Fixes cracked glass, touch delays, or broken digitized panels while preserving your original iPad LCD panel underneath.',
    category: 'ipad',
    price: 2899,
    originalPrice: 3999,
    duration: '80 mins',
    rating: 4.8,
    reviewsCount: 740,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
    features: [
      'Original performance oleophobic digitizer surface fuse',
      'Transfer of camera and ambient sensors',
      'Apple Pencil tracking accuracy verification',
      'Perfect edge adhesive wrap sealer'
    ]
  },
  {
    id: 'ipad-battery',
    name: 'iPad High-Capacity Battery Swap',
    description: 'Swaps heavily degraded tablet batteries to repair power cycles and sudden tablet shutdowns.',
    category: 'ipad',
    price: 2499,
    originalPrice: 3499,
    duration: '90 mins',
    rating: 4.7,
    reviewsCount: 390,
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&q=80&w=600',
    features: [
      'Safety compliance high density lithium cell core',
      'Careful chassis heating & dissolve process',
      'Solder connection interface check under stereo scope',
      'Power supply hardware safety verification'
    ]
  },
  {
    id: 'watch-screen',
    name: 'Smartwatch Retina Glass Refurbishing',
    description: 'For Apple Watch and premium WearOS watches. Swaps cracked outer glass element while keeping original OLED sensor matrix.',
    category: 'smartwatch',
    price: 3199,
    originalPrice: 4499,
    duration: '60 mins',
    rating: 4.8,
    reviewsCount: 650,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=600',
    features: [
      'Force Touch pressure sensor gasket replacement',
      'Hermetic UV curing water-resistance seal',
      'Optically pristine outer glass replacement layer',
      'Digitizer coordinate multi-touch calibration test'
    ]
  },
  {
    id: 'watch-battery',
    name: 'Smartwatch Li-Ion Battery Swap',
    description: 'Restores original multi-day battery backups of wearable devices showing rapid thermal wear or sudden power offs.',
    category: 'smartwatch',
    price: 1499,
    originalPrice: 1999,
    duration: '45 mins',
    rating: 4.6,
    reviewsCount: 480,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
    features: [
      'Safety grade miniature lithium cell replacement',
      'Micro-braided connection ribbon solder connection',
      'Standby rate power draw diagnostic sweep',
      'Waterproof sealing ring replacement setup'
    ]
  },
  {
    id: 'diagnostic-pack',
    name: 'Ultimate Full Device Diagnosis',
    description: 'Our digital benchmark device health check. Covers battery cycle counts, power IC draws, internal thermal pastes, and speaker mesh dust extraction.',
    category: 'all',
    price: 499,
    originalPrice: 1500,
    duration: '45 mins',
    rating: 5.0,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600',
    features: [
      'Complete internal ESD board diagnostics',
      'Microscopic mesh debris and dust layer clearing',
      'Deep processor thermal paste replenishment',
      'Full printed digital diagnostic analysis health report'
    ]
  }
];

export const STEPPING_TILES_REVIEWS = [
  {
    id: '1',
    userName: 'Akshay Kumar S',
    rating: 5,
    date: 'Yesterday',
    text: 'Got my iPhone display and battery replaced. Extremely fast service, they did it right in front of me at my office desk. Very polite behavior and reasonable price compared to the showroom.',
    serviceName: 'iPhone Display & Battery Swap',
    source: 'Google Review',
    image: '/B6322703-6B3A-4C45-8598-D1D8B659C8DB.png'
  },
  {
    id: '2',
    userName: 'Nikhil Gowda',
    rating: 5,
    date: '3 days ago',
    text: 'Excellent service for MacBook Air M1 motherboard repair. They diagnosed the water damage issue quickly and resolved it within a day. True professional board-level engineers!',
    serviceName: 'MacBook Motherboard Repair',
    source: 'Google Review',
    image: '/46965F49-3736-4542-B5E7-E1D33C448499.png'
  },
  {
    id: '3',
    userName: 'Praveen Nayak',
    rating: 5,
    date: '5 days ago',
    text: 'Highly recommended! Replaced my iPhone 13 Pro Max back glass. Their computer-guided laser separation rig in Koramangala is amazing. Pristine finish like original. Value for money.',
    serviceName: 'iPhone Laser Back Glass Replacement',
    source: 'Google Review',
    image: '/55253675-21CC-4C20-8A1B-8265E480237A.png'
  },
  {
    id: '4',
    userName: 'Megha Hegde',
    rating: 5,
    date: '1 week ago',
    text: 'Excellent experience. My iPhone Face ID and ear speaker issue was resolved within 45 mins. Price is quite reasonable. The best part is transparent doorstep service.',
    serviceName: 'FaceID Sensor Calibration',
    source: 'Google Review',
    image: '/EB5FA025-3FFA-42E9-AB09-136FE427D1FD.png'
  },
  {
    id: '5',
    userName: 'Karthik S',
    rating: 5,
    date: '1 week ago',
    text: 'Shattered screen of my MacBook Pro M1 was replaced. Perfect calibration and original colors. Completely satisfied with the instant dispatch to my HBR Layout home.',
    serviceName: 'MacBook Screen Replacement',
    source: 'Google Review',
    image: '/6D5ED1FD-3D99-44B9-8349-A9BF3B444CD7.png'
  },
  {
    id: '6',
    userName: 'Anil K',
    rating: 5,
    date: '2 weeks ago',
    text: 'Clean and honest work. They cleaned my iPhone charging port for free when I thought it had to be replaced. Real integrity and friendly team of technicians!',
    serviceName: 'Core Diagnostic Clean-up',
    source: 'Google Review',
    image: '/2.jpeg'
  },
  {
    id: '7',
    userName: 'Shwetha Rao',
    rating: 5,
    date: '2 weeks ago',
    text: 'Brought my swollen iPad battery for replacement. Quick and efficient. Done within 2 hours at their Marathahalli work desk. Very friendly staff and genuine spec parts.',
    serviceName: 'iPad High-Capacity Battery Swap',
    source: 'Google Review',
    image: '/5.jpeg'
  },
  {
    id: '8',
    userName: 'Sandhya Rao',
    rating: 5,
    date: '3 weeks ago',
    text: 'I was facing the permanent green line display issue on my iPhone 13 Pro. The technicians at the HBR Layout desk repaired it using micro-soldering wire matrix bypass. Works like charm, highly recommend!',
    serviceName: 'iPhone Display Screen Bypass',
    source: 'Google Review',
    image: '/3B0174DD-817D-4946-A66F-B9FC21DAC30F.png'
  },
  {
    id: '9',
    userName: 'Sanjay Deshmukh',
    rating: 5,
    date: '3 weeks ago',
    text: 'Highly accurate diagnostic software check. They hooked up my heating MacBook to their diagnostics program and pinpointed a thermal paste dry-out. Professional team!',
    serviceName: 'Ultimate Full Device Diagnosis',
    source: 'Google Review',
    image: '/e374078a-9b28-4708-9662-a1c513b3ab2b.jpeg'
  },
  {
    id: '10',
    userName: 'Abhishek Sen',
    rating: 5,
    date: '1 month ago',
    text: 'Very clean replacement of my cracked iPad screen. The calibration is extremely precise and works seamlessly with Apple Pencil. Doorstep toolkit they bring is highly advanced!',
    serviceName: 'iPad Digitizer Shock Injury Fix',
    source: 'Google Review',
    image: '/2BE84E7B-E075-41D4-923E-897BA047B363.png'
  },
  {
    id: '11',
    userName: 'Rohan Sharma',
    rating: 5,
    date: '1 month ago',
    text: 'Absolutely amazing! The technician arrived with a complete electrostatic discharge kit, professional screwdrivers, and did the repair right before my eyes. Fully trustworthy process.',
    serviceName: 'Doorstep Gadget Repair Kit',
    source: 'Google Review',
    image: '/IMG_1273.jpeg'
  },
  {
    id: '12',
    userName: 'Pooja Hegde',
    rating: 5,
    date: '1 month ago',
    text: 'Got my iPhone screen glass replaced and battery health restored back to 100%. Extremely satisfied with the behavior of the technicians. Fully professional team in Bengaluru!',
    serviceName: 'iPhone Battery & Screen Refurbish',
    source: 'Google Review',
    image: '/3.jpeg'
  }
];

export const FAQS = [
  {
    q: 'How does the FixerBaba 30-Day Guarantee work?',
    a: 'Every repair is covered by our unconditional 30-Day warranty. if any screen touch issue, battery decay, or charging anomaly recurs with the serviced item within 30 days, we repair or replace it completely free of cost immediately.'
  },
  {
    q: 'Are FixerBaba hardware engineers certified and background-verified?',
    a: 'Absolutely. Every partner undergoes 15 days of intensive engineering exams, biometric verification, criminal background check, and hands-on SMD micro-soldering trials.'
  },
  {
    q: 'Will iPhone screen replacements preserve TrueTone and FaceID?',
    a: 'Yes, our certified technicians use hardware calibration programmers to copy the screen serialization codes onto the replacement display assembly, keeping FaceID, TrueTone, and haptic feedback working smoothly.'
  },
  {
    q: 'Can I cancel or reschedule my booking later?',
    a: 'Yes, cancellations or reschedules are completely free up to 3 hours before the selected slot. You can do it with a single tap in the booking summary panel.'
  }
];
