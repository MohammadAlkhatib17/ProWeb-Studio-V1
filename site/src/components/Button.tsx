import Link from 'next/link';

interface BaseProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'large';
  className?: string;
}

interface LinkProps extends BaseProps {
  as?: 'a';
  href: string;
}

interface ButtonProps extends BaseProps {
  as: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

type ButtonComponentProps = LinkProps | ButtonProps;

export function Button(props: ButtonComponentProps) {
  const {
    children,
    variant = 'primary',
    size = 'normal',
    className = '',
    ...restProps
  } = props;

  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 magnetic-hover relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-cosmic-900 min-h-[44px] touch-target cursor-pointer no-underline hover:no-underline';
  const sizeClasses = size === 'large' ? 'px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 text-base sm:text-lg min-h-[44px]' : 'px-6 py-3 sm:px-8 sm:py-3.5 text-base min-h-[44px]';
  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-cyan-500 to-magenta-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] text-black'
      : 'border border-cyan-500/60 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-100 hover:shadow-lg hover:shadow-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]';

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  const gradientOverlays = (
    <>
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-magenta-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
        </>
      )}
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
        {children}
      </span>
    </>
  );

  if (props.as === 'button') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _, ...buttonProps } = restProps as ButtonProps;
    return (
      <button
        type={buttonProps.type || 'button'}
        onClick={buttonProps.onClick}
        disabled={buttonProps.disabled}
        className={combinedClasses}
      >
        {gradientOverlays}
      </button>
    );
  }

  // Default to link behavior
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _, href, ...linkProps } = restProps as LinkProps;
  return (
    <Link
      href={href}
      className={combinedClasses}
      {...linkProps}
    >
      {gradientOverlays}
    </Link>
  );
}

// Keep backward compatibility
export default Button;
