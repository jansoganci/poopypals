import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  defaultValue?: string;
  onChange?: (time: string) => void;
}

export function TimeInput({ 
  className, 
  defaultValue = '00:00',
  onChange,
  ...props 
}: TimeInputProps) {
  const [time, setTime] = useState(defaultValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange?.(newTime);
  };
  
  return (
    <Input
      type="time"
      className={cn("w-full", className)}
      value={time}
      onChange={handleChange}
      {...props}
    />
  );
}