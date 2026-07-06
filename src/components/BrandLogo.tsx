import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Sizing definitions for the custom logo
  const heights = {
    sm: 'h-9 sm:h-10',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
  }[size];

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* 
        This is the actual user-provided logo image: /IMG_1273.jpeg.
        To implement "remove bg" on a JPEG with a black background dynamically in pure CSS:
        
        - In Light Mode (default):
          We apply 'invert' to turn the black background to white, and the white text/lines to black.
          We then apply 'mix-blend-multiply' which makes pure white pixels completely transparent,
          allowing the black text and logo to overlay perfectly on our light header/footer backgrounds!
          
        - In Dark Mode (dark:):
          We keep 'invert-0' to retain the original white text and graphics on black.
          We then apply 'mix-blend-screen' which makes the pure black background completely transparent
          on any dark or OLED black surfaces!
      */}
      <img
        decoding="async"
        src="/46965F49-3736-4542-B5E7-E1D33C448499.png"
        alt="FixerBaba"
        referrerPolicy="no-referrer"
        className={`${heights} w-auto object-contain transition-all duration-300 invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen`}
      />
    </div>
  );
};
