import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, onComplete }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const chars = value.split('');
    chars[idx] = digit;
    const newVal = chars.join('');
    onChange(newVal);

    if (digit && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }

    if (newVal.length === 6 && onComplete) {
      onComplete(newVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(paste);
    if (paste.length === 6 && onComplete) {
      onComplete(paste);
    }
  };

  return (
    <div className=flex justify-center gap-2.5 onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type=text
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className=otp-input-box
        />
      ))}
    </div>
  );
};
