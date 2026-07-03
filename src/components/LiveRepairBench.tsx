import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle2, User, Wrench, MessageSquare, ExternalLink, X, Activity, Layers } from 'lucide-react';
import { AREA_WHATSAPP_LINKS } from '../data';

interface RepairJob {
  id: string;
  image: string;
  title: string;
  category: 'iphone' | 'macbook' | 'workshop' | 'team';
  categoryLabel: string;
  desk: 'Koramangala' | 'Marathahalli' | 'HBR Layout' | 'Bengaluru Central';
  tech: string;
  status: 'Completed & Delivered' | 'Active Bench' | 'Verified HQ';
  date: string;
  notes: string;
}

const REPAIR_GALLERY_DATA: RepairJob[] = [
  {
    id: 'job-team-group',
    image: '/e374078a-9b28-4708-9662-a1c513b3ab2b.jpeg',
    title: 'FixerBaba Certified Engineering Squad',
    category: 'team',
    categoryLabel: 'Engineering Team',
    desk: 'Bengaluru Central',
    tech: 'All-Star Tech Team',
    status: 'Verified HQ',
    date: 'June 2026',
    notes: 'The direct logistics backbone of FixerBaba. Every technician undergoes comprehensive background vetting and advanced board-level examinations.'
  },
  {
    id: 'job-laser-1',
    image: '/55253675-21CC-4C20-8A1B-8265E480237A.png',
    title: 'iPhone 14 Pro Max Laser Separation',
    category: 'iphone',
    categoryLabel: 'Laser Separation',
    desk: 'Koramangala',
    tech: 'Yogesh K.',
    status: 'Completed & Delivered',
    date: 'Today',
    notes: 'Utilized computer-guided cold-laser separation rig to cleanly lift shattered back glass without transferring structural heat stress to the internal lithium battery.'
  },
  {
    id: 'job-mb-1',
    image: '/46965F49-3736-4542-B5E7-E1D33C448499.png',
    title: 'MacBook Air M2 Chipset Repair',
    category: 'macbook',
    categoryLabel: 'MacBook Logic Board',
    desk: 'Marathahalli',
    tech: 'Pranav M.',
    status: 'Completed & Delivered',
    date: 'Yesterday',
    notes: 'Complex micro-soldering job restoring corroded SMD logic tracks caused by accidental tea spill. Verified 100% user-state and key data intact.'
  },
  {
    id: 'job-green-line',
    image: '/3B0174DD-817D-4946-A66F-B9FC21DAC30F.png',
    title: 'iPhone 13 Pro Green Line Screen Calibration',
    category: 'iphone',
    categoryLabel: 'Display Calibration',
    desk: 'HBR Layout',
    tech: 'Tanmay S.',
    status: 'Completed & Delivered',
    date: '2 days ago',
    notes: 'Resolved permanent green screen vertical pixel lines by microsurgery on the copper ribbon matrix bus and post-alignment core display re-serialization.'
  },
  {
    id: 'job-glass-smashed',
    image: '/2BE84E7B-E075-41D4-923E-897BA047B363.png',
    title: 'iPhone 15 Pro Smashed Chassis Rebuilt',
    category: 'iphone',
    categoryLabel: 'Chassis & Back Glass',
    desk: 'Koramangala',
    tech: 'Yogesh K.',
    status: 'Completed & Delivered',
    date: '3 days ago',
    notes: 'Complete physical back glass reconstitution under 30 minutes, cleanly bypassing side chassis warping to retain flawless wireless magnetic charging.'
  },
  {
    id: 'job-ic-soldering',
    image: '/6D5ED1FD-3D99-44B9-8349-A9BF3B444CD7.png',
    title: 'iPhone PMIC Power Controller Reflow',
    category: 'iphone',
    categoryLabel: 'Power & Charging IC',
    desk: 'HBR Layout',
    tech: 'Tanmay S.',
    status: 'Completed & Delivered',
    date: '4 days ago',
    notes: 'Diagnosed sudden power-off fault using thermal heat-cam and carefully swapped out shorted PMIC logic IC using microscopic reflow workstation.'
  },
  {
    id: 'job-display-truetone',
    image: '/B6322703-6B3A-4C45-8598-D1D8B659C8DB.png',
    title: 'iPhone 15 Display Serialization Restore',
    category: 'iphone',
    categoryLabel: 'OLED Display Swap',
    desk: 'Marathahalli',
    tech: 'Pranav M.',
    status: 'Completed & Delivered',
    date: '5 days ago',
    notes: 'Fitted premium original specification OLED panel. Calibrated and synced the direct screen TrueTone serial matrix onto the central board.'
  },
  {
    id: 'job-faceid-depth',
    image: '/EB5FA025-3FFA-42E9-AB09-136FE427D1FD.png',
    title: 'FaceID TrueDepth Sensor Reconstruction',
    category: 'iphone',
    categoryLabel: 'FaceID & Diagnostics',
    desk: 'Koramangala',
    tech: 'Yogesh K.',
    status: 'Completed & Delivered',
    date: '6 days ago',
    notes: 'Resoldered micro TrueDepth infrared emitter array alignment to safely fix "FaceID Not Available" warning after heavy physical screen crash.'
  },
  {
    id: 'job-desk-kora',
    image: '/2.jpeg',
    title: 'Koramangala Alpha Core Workstation',
    category: 'workshop',
    categoryLabel: 'Diagnostic Lab',
    desk: 'Koramangala',
    tech: 'Bench Alpha',
    status: 'Active Bench',
    date: 'Live Status',
    notes: 'Equipped with computer-controlled laser separation, digital HDMI microscopes, high-frequency soldering irons, and precision air reflow controllers.'
  },
  {
    id: 'job-desk-hbr',
    image: '/3.jpeg',
    title: 'HBR Layout Gamma Micro-soldering Rig',
    category: 'workshop',
    categoryLabel: 'Diagnostic Lab',
    desk: 'HBR Layout',
    tech: 'Bench Gamma',
    status: 'Active Bench',
    date: 'Live Status',
    notes: 'Our specialized station in HBR Layout configured primarily for fine-pitch micro SMD repair, IC controller swaps, and logical component diagnostics.'
  },
  {
    id: 'job-desk-marath',
    image: '/5.jpeg',
    title: 'Marathahalli Beta Heavy Calibration Desk',
    category: 'workshop',
    categoryLabel: 'Diagnostic Lab',
    desk: 'Marathahalli',
    tech: 'Bench Beta',
    status: 'Active Bench',
    date: 'Live Status',
    notes: 'Optimized workspace specialized in multi-layer logic routing, screen re-lamination, computer guided alignment tools, and safety battery cycles.'
  }
];

export const LiveRepairBench: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'iphone' | 'macbook' | 'workshop' | 'team'>('all');
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);

  const filteredJobs = REPAIR_GALLERY_DATA.filter(
    (job) => activeFilter === 'all' || job.category === activeFilter
  );

  return (
    <div id="live-repair-bench-container" className="space-y-10">
      {/* Header and Filter Menu */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/25 rounded-full tracking-wider border border-emerald-500/20 animate-pulse">
            <Activity className="w-3 h-3" />
            <span>FixerBaba Live Bench Proof</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-bento-text tracking-tight">
            Our Live Work &amp; Repair Desk Logs
          </h2>
          <p className="text-xs text-bento-sub font-semibold max-w-xl">
            Real uncensored snapshots taken directly from our active repair benches in Koramangala, Marathahalli, and HBR Layout. Tap on any log to view specs and technician notes.
          </p>
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-bento-bg/70 dark:bg-neutral-850/60 rounded-2xl border border-bento-border/80 self-start md:self-end">
          {(['all', 'iphone', 'macbook', 'workshop', 'team'] as const).map((tab) => {
            const labels = {
              all: 'All Logs',
              iphone: 'iPhone Repairs',
              macbook: 'MacBook Boards',
              workshop: 'Our Workstations',
              team: 'Team Squad'
            };
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                  isActive
                    ? 'bg-bento-card text-bento-text shadow-xs border border-bento-border'
                    : 'text-bento-sub hover:text-bento-text'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of repair photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="group relative bg-bento-card border border-bento-border rounded-[24px] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-300"
          >
            {/* Image Aspect ratio box */}
            <div className="aspect-square w-full relative overflow-hidden bg-neutral-900/50">
              <img
                src={job.image}
                alt={job.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              
              {/* Desk Tag */}
              <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-black uppercase bg-black/70 backdrop-blur-md text-white rounded-md tracking-wider border border-white/10">
                {job.desk}
              </span>

              {/* Status Badge */}
              <span className={`absolute top-3 right-3 px-2 py-0.5 text-[8px] font-bold rounded-md flex items-center gap-1 ${
                job.status === 'Completed & Delivered' 
                  ? 'bg-emerald-500/95 text-white' 
                  : 'bg-amber-500/95 text-neutral-900'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {job.status}
              </span>
            </div>

            {/* Title / Info Overlay */}
            <div className="p-4 text-left space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-bento-blue">
                {job.categoryLabel}
              </span>
              <h4 className="text-xs font-bold text-bento-text truncate group-hover:text-bento-blue transition-colors">
                {job.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-bento-sub pt-1">
                <span className="font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-bento-sub/70" />
                  {job.tech}
                </span>
                <span className="font-bold text-neutral-400">{job.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox details modal when a photo is tapped */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative bg-bento-card border border-bento-border rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Huge Preview Image */}
            <div className="md:w-1/2 aspect-square md:aspect-auto md:h-full relative bg-black/40 min-h-[300px] flex items-center justify-center overflow-hidden">
              <img
                src={selectedJob.image}
                alt={selectedJob.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="px-3 py-1 text-[10px] font-black uppercase bg-black/85 text-white rounded-md tracking-wider border border-white/10 self-start">
                  {selectedJob.desk} Desk
                </span>
                <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-bento-blue text-white rounded-md tracking-wider self-start">
                  {selectedJob.categoryLabel}
                </span>
              </div>
            </div>

            {/* Right Column: Specifications & Technicians Comments */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Repair Session Log</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-bento-text leading-tight pt-1">
                    {selectedJob.title}
                  </h3>
                </div>

                <div className="p-4 bg-bento-bg rounded-2xl border border-bento-border/70 text-xs text-bento-sub font-semibold leading-relaxed">
                  <span className="block text-[10px] font-bold uppercase text-bento-blue mb-1">Technician Review Notes:</span>
                  "{selectedJob.notes}"
                </div>

                {/* Logistics metadata */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-bold">
                  <div className="p-3 bg-bento-bg rounded-xl border border-bento-border/50">
                    <span className="block text-[8px] uppercase tracking-wider text-bento-sub font-black">Lead Specialist</span>
                    <span className="text-bento-text block mt-0.5">{selectedJob.tech}</span>
                  </div>
                  <div className="p-3 bg-bento-bg rounded-xl border border-bento-border/50">
                    <span className="block text-[8px] uppercase tracking-wider text-bento-sub font-black">Session Stamp</span>
                    <span className="text-bento-text block mt-0.5">{selectedJob.date} ({selectedJob.status})</span>
                  </div>
                </div>
              </div>

              {/* Directly reach this location's WhatsApp dispatch */}
              <div className="pt-4 border-t border-bento-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] font-semibold text-bento-sub">
                  Need a similar high-precision repair?
                </div>
                <a
                  href={
                    selectedJob.desk === 'Bengaluru Central'
                      ? AREA_WHATSAPP_LINKS['Koramangala'] // fallback to Koramangala
                      : AREA_WHATSAPP_LINKS[selectedJob.desk]
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-neutral-900 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Connect to Desk</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
