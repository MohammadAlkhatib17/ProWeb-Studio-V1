// /src/components/Logo.tsx
import Image from 'next/image';

export interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  withGlow = true, // Defaulting to true for a more luminous feel
  animated = true,
}: LogoProps) {
  const sizes = {
    sm: 'h-14 w-auto md:h-11 md:w-auto', // Mobile: 56px, Desktop: 44px - substantial mobile presence
    md: 'h-16 w-auto md:h-14 md:w-auto', // Mobile: 64px, Desktop: 56px - prominent mobile visibility
    lg: 'h-20 w-auto md:h-16 md:w-auto', // Mobile: 80px, Desktop: 64px - strong mobile presence
    xl: 'h-24 w-auto md:h-18 md:w-auto', // Mobile: 96px, Desktop: 72px - maximum mobile prominence
  };

  // The new bloom animation is applied conditionally
  const animationEffect =
    animated && withGlow ? 'motion-safe:animate-bloom' : '';

  const baseClasses = `${sizes[size]} transition-all duration-300 ${className}`;

  if (variant === 'icon') {
    return (
      <div className={baseClasses}>
        <Image
          src="/assets/logo/logo-proweb-icon.svg"
          alt="ProWeb Studio Icoon"
          width={64}
          height={64}
          className={`h-full w-full ${animationEffect}`}
          priority
        />
      </div>
    );
  }

  // 'full' variant uses the lockup design with ProWeb Studio text
  return (
    <div
      className={`inline-flex items-center ${baseClasses}`}
      aria-label="ProWeb Studio Logo"
    >
      <Image
        src="/assets/logo/logo-proweb-lockup.svg"
        alt="ProWeb Studio Logo"
        width={200}
        height={64}
        className={`h-full w-auto ${animationEffect}`}
        style={{
          filter: withGlow
            ? 'drop-shadow(0 0 10px rgba(52, 211, 238, 0.3))'
            : 'none',
        }}
        priority
      />
    </div>
  );
}
