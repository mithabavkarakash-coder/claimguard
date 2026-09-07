import React from 'react';

interface AegisHealthLogoProps {
  className?: string;
  showText?: boolean;
}

export const AegisHealthLogo: React.FC<AegisHealthLogoProps> = ({ 
  className = "h-8 w-auto", 
  showText = true 
}) => {
  return (
    <div className="flex items-center gap-2">
      <svg className={className} viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="24" height="24" rx="7" fill="#0D52D6"/>
        <path d="M14 9v14M7 16h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="14" cy="16" r="3" fill="#60A5FA"/>
        {showText && (
          <text x="34" y="21" fontFamily="Inter, system-ui, sans-serif" fontSize="15" fontWeight="700" fill="#0F172A" letterSpacing="-0.02em">
            Claim<tspan fill="#0D52D6">Guard</tspan>
          </text>
        )}
      </svg>
    </div>
  );
};
