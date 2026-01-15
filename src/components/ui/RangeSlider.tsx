'use client';

import { useId } from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
}

export function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  formatValue,
}: RangeSliderProps) {
  const id = useId();

  const displayValue = formatValue
    ? formatValue(value)
    : `${prefix}${value.toLocaleString()}${suffix}`;

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--gray-600)]"
        >
          {label}
        </label>
        <span className="text-lg font-semibold text-[var(--black)] tabular-nums">
          {displayValue}
        </span>
      </div>

      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full h-2 rounded-full appearance-none cursor-pointer
            bg-[var(--gray-200)]
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--black)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[var(--black)]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-md
            focus:outline-none
          "
          style={{
            background: `linear-gradient(to right, var(--black) 0%, var(--black) ${percentage}%, var(--gray-200) ${percentage}%, var(--gray-200) 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-[var(--gray-400)]">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}
