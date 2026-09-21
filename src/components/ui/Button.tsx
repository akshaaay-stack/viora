import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'viora-btn-primary shadow-sm hover:shadow-md',
    secondary: 'viora-btn-secondary shadow-sm hover:shadow-md',
    outline: 'viora-btn-outline hover:bg-slate-100',
    danger: 'bg-red-600 text-white rounded-full hover:bg-red-700 min-h-[48px]',
    ghost: 'text-viora-navy hover:bg-slate-100 rounded-xl min-h-[48px]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  return (
    <button
      className={${base}   }
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className=flex items-center gap-2>
          <span className=w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin></span>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {icon && <span className=mr-2 shrink-0>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
