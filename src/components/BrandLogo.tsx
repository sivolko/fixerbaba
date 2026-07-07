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
        This is the actual user-provided logo image: /e374078a-9b28-4708-9662-a1c513b3ab2b.jpeg
        ("FIXER BABA — Your phone is in safe Hands", white artwork on a solid black background).

        To make a single flat JPEG work cleanly on both light and dark surfaces without a
        separate transparent asset, we key off the fact that the source is white-on-black:

        - In Light Mode (default):
          'invert' flips it to black artwork on a white background, then 'mix-blend-multiply'
          makes the now-white background pixels fully transparent, leaving only the black
          logo/text visible against whatever light surface it sits on.

        - In Dark Mode (dark:):
          'invert-0' keeps the original white-on-black artwork, and 'mix-blend-screen' makes
          the black background pixels fully transparent, leaving only the white logo/text
          visible against any dark or OLED-black surface.
      */}
      <img
        decoding="async"
        src="/e374078a-9b28-4708-9662-a1c513b3ab2b.jpeg"
        alt="FixerBaba — Your phone is in safe hands"
        referrerPolicy="no-referrer"
        className={`${heights} w-auto object-contain transition-all duration-300 invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen`}
      />
    </div>
  );
};
