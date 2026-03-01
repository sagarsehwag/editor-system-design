'use client';

import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`demo-textarea ${className}`.trim()}
      {...props}
    />
  );
}
