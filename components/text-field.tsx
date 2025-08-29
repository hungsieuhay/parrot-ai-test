/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import clsx from 'clsx';
import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

// Types for the custom input component
interface CustomInputProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  disabled?: boolean;
  error?: FieldError;
  className?: string;
}

// Custom Input Component
export const CustomInput = ({
  name,
  control,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  className,
}: CustomInputProps) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={name}
            className={clsx(
              'bg-input w-full rounded-lg border border-transparent py-4 pr-10 pl-5 text-lg text-white outline-none placeholder:text-gray-100 hover:placeholder:text-white',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
          />
        )}
      />
      {error && (
        <p className="mt-1 text-start text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
