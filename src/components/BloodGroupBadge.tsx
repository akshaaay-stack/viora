import React from 'react';
import { BloodGroup } from '../types/database';

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  bloodGroup,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-lg px-5 py-2.5'
  };

  return (
    <span
      className={inline-flex items-center gap-1.5 rounded-full font-bold bg-viora-red-light text-viora-red border border-red-200 tracking-wide  }
    >
      <span className=text-viora-muted font-normal text-xs uppercase>Blood Group:</span>
      <strong className=font-extrabold text-viora-red>{bloodGroup}</strong>
    </span>
  );
};
