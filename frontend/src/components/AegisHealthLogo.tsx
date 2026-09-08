import React from 'react';

interface AegisHealthLogoProps {
  className?: string;
  showText?: boolean;
  brandText?: 'AegisHealth' | 'ClaimGuard';
}

export const AegisHealthLogo: React.FC<AegisHealthLogoProps> = ({ 
  className = "h-8 w-auto", 
  showText = true,
  brandText = "AegisHealth"
}) => {
  return (
    <div className="flex items-center gap-2">
      <svg className={className} viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="24" height="24" rx="7" fill="#0D52D6"/>
        <path d="M14 9v14M7 16h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="14" cy="16" r="3" fill="#60A5FA"/>
        {showText && (
          <text x="34" y="21" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="700" fill="#131B2E" letterSpacing="-0.02em">
            {brandText === 'ClaimGuard' ? (
              <>Claim<tspan fill="#0D52D6">Guard</tspan></>
            ) : (
              <>Aegis<tspan fill="#0D52D6">Health</tspan></>
            )}
          </text>
        )}
      </svg>
    </div>
  );
};

