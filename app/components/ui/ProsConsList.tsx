'use client';

import React from 'react';

type ProsConsItem = {
  type: 'pro' | 'con';
  text: string;
};

type ProsConsListProps = {
  items: ProsConsItem[];
  className?: string;
};

export function ProsConsList({ items, className = '' }: ProsConsListProps) {
  return (
    <ul className={`pros-cons ${className}`.trim()}>
      {items.map((item, i) => (
        <li key={i} className={item.type}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
