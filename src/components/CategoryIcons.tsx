import React from 'react';

export interface CategoryIconProps {
  className?: string;
}

// 1. Fruits & Vegetables
export function FruitsVeggiesIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#F0FDF4" stroke="#10B981" strokeWidth="2"/>
      {/* Apple */}
      <circle cx="45" cy="52" r="18" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
      <path d="M45 34C45 34 48 30 50 30C52 30 54 32 54 34" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
      {/* Leaf */}
      <ellipse cx="52" cy="32" rx="4" ry="6" fill="#10B981" stroke="#059669" strokeWidth="1.5"/>
      {/* Carrot */}
      <path d="M68 42L62 70" stroke="#F97316" strokeWidth="4" strokeLinecap="round"/>
      <path d="M65 36L68 42L71 36" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 2. Dairy & Refrigerated
export function DairyIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2"/>
      {/* Milk Bottle */}
      <rect x="35" y="35" width="20" height="35" rx="2" fill="white" stroke="#3B82F6" strokeWidth="2"/>
      <rect x="37" y="32" width="16" height="4" fill="#3B82F6"/>
      <circle cx="45" cy="50" r="3" fill="#93C5FD"/>
      {/* Cheese Wedge */}
      <path d="M60 55L70 70L55 70Z" fill="#FDE047" stroke="#EAB308" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="63" cy="64" r="2" fill="#CA8A04"/>
      <circle cx="66" cy="67" r="1.5" fill="#CA8A04"/>
    </svg>
  );
}

// 3. Bakery & Bread
export function BakeryIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
      {/* Bread Loaf */}
      <ellipse cx="50" cy="58" rx="22" ry="12" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
      <path d="M30 58Q35 48 50 48Q65 48 70 58" fill="#FBBF24" stroke="#D97706" strokeWidth="2"/>
      {/* Score marks */}
      <path d="M40 52Q42 54 44 52" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M50 50Q52 52 54 50" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M58 52Q60 54 62 52" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Steam */}
      <path d="M42 38Q44 34 46 38" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M50 35Q52 31 54 35" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M58 38Q60 34 62 38" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// 4. Eggs, Meat & Frozen
export function EggsMeatIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FEF2F2" stroke="#F87171" strokeWidth="2"/>
      {/* Egg */}
      <ellipse cx="42" cy="52" rx="12" ry="16" fill="white" stroke="#FCA5A5" strokeWidth="2"/>
      <path d="M38 52L42 52L40 56Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5"/>
      {/* Crack line */}
      <path d="M35 48Q38 50 41 48" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* Snowflake */}
      <g transform="translate(60, 50)">
        <path d="M0 -10L0 10M-10 0L10 0M-7 -7L7 7M-7 7L7 -7" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="0" cy="0" r="2" fill="#3B82F6"/>
      </g>
    </svg>
  );
}

// 5. Staples (Rice, Wheat, Pulses)
export function StaplesIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2"/>
      {/* Wheat Stalk */}
      <path d="M60 70L60 35" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="58" cy="40" rx="4" ry="3" fill="#FCD34D"/>
      <ellipse cx="62" cy="45" rx="4" ry="3" fill="#FCD34D"/>
      <ellipse cx="58" cy="50" rx="4" ry="3" fill="#FCD34D"/>
      <ellipse cx="62" cy="55" rx="4" ry="3" fill="#FCD34D"/>
      <ellipse cx="58" cy="60" rx="4" ry="3" fill="#FCD34D"/>
      {/* Rice Grains */}
      <ellipse cx="40" cy="55" rx="2.5" ry="4" fill="white" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="45" cy="57" rx="2.5" ry="4" fill="white" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="38" cy="60" rx="2.5" ry="4" fill="white" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="43" cy="62" rx="2.5" ry="4" fill="white" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="40" cy="66" rx="2.5" ry="4" fill="white" stroke="#D97706" strokeWidth="1.5"/>
    </svg>
  );
}

// 6. Oils & Ghee
export function OilsIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FFFBEB" stroke="#FBBF24" strokeWidth="2"/>
      {/* Oil Container */}
      <path d="M40 70L40 42C40 40 41 38 43 38L57 38C59 38 60 40 60 42L60 70Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
      <rect x="43" y="33" width="14" height="6" rx="1" fill="#F59E0B"/>
      <circle cx="50" cy="36" r="2" fill="#FCD34D"/>
      {/* Oil level */}
      <path d="M42 55L58 55" stroke="#FBBF24" strokeWidth="1.5"/>
      {/* Oil Drop */}
      <path d="M50 48C50 48 46 52 46 56C46 58 48 60 50 60C52 60 54 58 54 56C54 52 50 48 50 48Z" 
            fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
    </svg>
  );
}

// 7. Masala, Salt & Sugar
export function MasalaIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2"/>
      {/* Spice Jar */}
      <rect x="38" y="42" width="24" height="28" rx="2" fill="white" stroke="#DC2626" strokeWidth="2"/>
      <rect x="40" y="38" width="20" height="5" rx="1" fill="#DC2626"/>
      {/* Spices inside */}
      <circle cx="45" cy="55" r="2" fill="#EF4444"/>
      <circle cx="52" cy="58" r="2" fill="#F97316"/>
      <circle cx="48" cy="62" r="2" fill="#DC2626"/>
      <circle cx="55" cy="53" r="2" fill="#F59E0B"/>
      {/* Sprinkle dots */}
      <circle cx="35" cy="35" r="1.5" fill="#EF4444"/>
      <circle cx="65" cy="38" r="1.5" fill="#F97316"/>
      <circle cx="33" cy="50" r="1.5" fill="#DC2626"/>
      <circle cx="67" cy="48" r="1.5" fill="#F59E0B"/>
      <circle cx="36" cy="65" r="1.5" fill="#EF4444"/>
      <circle cx="66" cy="62" r="1.5" fill="#F97316"/>
    </svg>
  );
}

// 8. Packaged Snacks
export function SnacksIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
      {/* Packet */}
      <path d="M35 40L38 70L62 70L65 40Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      {/* Zigzag seal */}
      <path d="M35 40L38 37L41 40L44 37L47 40L50 37L53 40L56 37L59 40L62 37L65 40" 
            stroke="#F59E0B" strokeWidth="2" fill="none"/>
      {/* Snack dots */}
      <circle cx="45" cy="52" r="2" fill="#F97316"/>
      <circle cx="52" cy="55" r="2" fill="#F97316"/>
      <circle cx="48" cy="58" r="2" fill="#F97316"/>
      <circle cx="55" cy="50" r="2" fill="#F97316"/>
      <circle cx="50" cy="62" r="2" fill="#F97316"/>
      {/* Brand label area */}
      <rect x="42" y="44" width="16" height="8" rx="2" fill="white" opacity="0.7"/>
    </svg>
  );
}

// 9. Beverages & Mixers
export function BeveragesIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2"/>
      {/* Glass */}
      <path d="M40 38L38 70L62 70L60 38Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      {/* Liquid */}
      <path d="M39 55L61 55L60.5 70L38.5 70Z" fill="#60A5FA" opacity="0.6"/>
      {/* Ice cubes */}
      <rect x="44" y="58" width="5" height="5" fill="white" opacity="0.8" stroke="#93C5FD" strokeWidth="1"/>
      <rect x="52" y="62" width="5" height="5" fill="white" opacity="0.8" stroke="#93C5FD" strokeWidth="1"/>
      {/* Straw */}
      <path d="M55 35L52 70" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="53" y="33" width="4" height="4" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
      {/* Droplet */}
      <path d="M68 45C68 45 65 48 65 50C65 51.5 66 52.5 68 52.5C70 52.5 71 51.5 71 50C71 48 68 45 68 45Z" 
            fill="#3B82F6"/>
    </svg>
  );
}

// 10. Cleaning & Consumables
export function CleaningIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="2"/>
      {/* Spray Bottle */}
      <rect x="42" y="48" width="16" height="25" rx="2" fill="#A7F3D0" stroke="#14B8A6" strokeWidth="2"/>
      <rect x="46" y="43" width="8" height="6" fill="#14B8A6"/>
      {/* Nozzle */}
      <path d="M50 43L50 38L56 38" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="56" cy="38" r="2" fill="#14B8A6"/>
      {/* Spray lines */}
      <path d="M58 36L62 32" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M58 38L64 36" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M58 40L63 42" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round"/>
      {/* Sparkle */}
      <path d="M35 35L37 37L35 39L33 37Z" fill="#FCD34D"/>
      <path d="M35 37L33 37L35 35L37 37Z" fill="#FBBF24"/>
    </svg>
  );
}

// 11. Personal Care & Wellness
export function PersonalCareIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FAF5FF" stroke="#A855F7" strokeWidth="2"/>
      {/* Shampoo Bottle */}
      <path d="M42 70L42 45C42 43 43 42 45 42L55 42C57 42 58 43 58 45L58 70Z" 
            fill="#E9D5FF" stroke="#A855F7" strokeWidth="2"/>
      <ellipse cx="50" cy="70" rx="8" ry="3" fill="#D8B4FE"/>
      {/* Cap */}
      <rect x="45" y="36" width="10" height="7" rx="2" fill="#A855F7"/>
      <rect x="47" y="33" width="6" height="4" rx="1" fill="#C084FC"/>
      {/* Droplets */}
      <path d="M50 52C50 52 48 54 48 56C48 57 49 58 50 58C51 58 52 57 52 56C52 54 50 52 50 52Z" 
            fill="#C084FC"/>
      <circle cx="35" cy="55" r="2" fill="#E9D5FF"/>
      <circle cx="32" cy="48" r="2.5" fill="#DDD6FE"/>
    </svg>
  );
}

// 12. Baby & Family Essentials
export function BabyIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FFF7ED" stroke="#FB923C" strokeWidth="2"/>
      {/* Baby Bottle */}
      <rect x="42" y="45" width="16" height="28" rx="8" fill="#FED7AA" stroke="#FB923C" strokeWidth="2"/>
      {/* Nipple */}
      <ellipse cx="50" cy="43" rx="5" ry="4" fill="#FDBA74" stroke="#FB923C" strokeWidth="2"/>
      <circle cx="50" cy="41" r="2" fill="#FB923C"/>
      {/* Measurement marks */}
      <path d="M44 52L48 52" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M44 58L48 58" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M44 64L48 64" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Milk level */}
      <path d="M43 60L57 60" stroke="#FDBA74" strokeWidth="2"/>
      {/* Highlight strokes */}
      <path d="M54 48Q56 52 54 56" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M53 62Q55 66 53 70" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

// 13. Packaging & Store Supplies
export function PackagingIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#F5F5F4" stroke="#78716C" strokeWidth="2"/>
      {/* Box */}
      <path d="M35 50L35 70L65 70L65 50Z" fill="#E7E5E4" stroke="#78716C" strokeWidth="2"/>
      <path d="M35 50L50 40L65 50" fill="#D6D3D1" stroke="#78716C" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M50 40L50 70" stroke="#78716C" strokeWidth="2"/>
      {/* Box flaps */}
      <path d="M35 50L42 46L50 50" fill="#F5F5F4" stroke="#78716C" strokeWidth="1.5"/>
      <path d="M65 50L58 46L50 50" fill="#F5F5F4" stroke="#78716C" strokeWidth="1.5"/>
      {/* Arrow */}
      <path d="M50 58L50 48M50 48L46 52M50 48L54 52" 
            stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 14. Clearance / Near-Expiry
export function ClearanceIcon({ className = "w-16 h-16" }: CategoryIconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2"/>
      {/* Warning Triangle */}
      <path d="M50 32L68 62L32 62Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Exclamation mark */}
      <path d="M50 42L50 52" stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="56" r="2" fill="#DC2626"/>
      {/* Clock symbol */}
      <circle cx="62" cy="45" r="8" fill="white" stroke="#F97316" strokeWidth="2"/>
      <path d="M62 42L62 45L64 47" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Category data export
export const categories = [
  { id: 1, name: 'Fruits & Vegetables', Icon: FruitsVeggiesIcon, color: '#10B981' },
  { id: 2, name: 'Dairy & Refrigerated', Icon: DairyIcon, color: '#3B82F6' },
  { id: 3, name: 'Bakery & Bread', Icon: BakeryIcon, color: '#F59E0B' },
  { id: 4, name: 'Eggs, Meat & Frozen', Icon: EggsMeatIcon, color: '#F87171' },
  { id: 5, name: 'Staples', Icon: StaplesIcon, color: '#FBBF24' },
  { id: 6, name: 'Oils & Ghee', Icon: OilsIcon, color: '#F59E0B' },
  { id: 7, name: 'Masala, Salt & Sugar', Icon: MasalaIcon, color: '#DC2626' },
  { id: 8, name: 'Packaged Snacks', Icon: SnacksIcon, color: '#F97316' },
  { id: 9, name: 'Beverages & Mixers', Icon: BeveragesIcon, color: '#3B82F6' },
  { id: 10, name: 'Cleaning & Consumables', Icon: CleaningIcon, color: '#14B8A6' },
  { id: 11, name: 'Personal Care & Wellness', Icon: PersonalCareIcon, color: '#A855F7' },
  { id: 12, name: 'Baby & Family Essentials', Icon: BabyIcon, color: '#FB923C' },
  { id: 13, name: 'Packaging & Store Supplies', Icon: PackagingIcon, color: '#78716C' },
  { id: 14, name: 'Clearance / Near-Expiry', Icon: ClearanceIcon, color: '#DC2626' },
];
