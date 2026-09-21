import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftPrefix?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftPrefix,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className=w-full>
      {label && (
        <label htmlFor={id} className=block text-sm font-semibold text-viora-text mb-1.5>
          {label}
        </label>
      )}
      <div className=flex items-center relative>
        {leftPrefix && (
          <div className=inline-flex items-center px-3.5 h-[52px] rounded-l-xl border border-r-0 border-viora-border bg-slate-50 text-viora-text font-bold text-base select-none>
            {leftPrefix}
          </div>
        )}
        <input
          id={id}
          className={iora-input w-full   }
          {...props}
        />
      </div>
      {error && <p className=text-xs text-red-600 mt-1.5 font-medium>{error}</p>}
      {helperText && !error && <p className=text-xs text-viora-muted mt-1.5>{helperText}</p>}
    </div>
  );
};
