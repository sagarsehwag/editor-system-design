'use client';

import React from 'react';

type KeyValueItem = {
  key: string;
  value: React.ReactNode;
  valueRef?: React.RefObject<HTMLSpanElement | null>;
  highlight?: boolean;
};

type KeyValueListProps = {
  items: KeyValueItem[];
  className?: string;
};

export function KeyValueList({ items, className = '' }: KeyValueListProps) {
  return (
    <div className={`state-display ds-key-value-list ${className}`.trim()}>
      {items.map((item) => (
        <div
          key={item.key}
          className={`state-row ${item.highlight ? 'highlight' : ''}`}
        >
          <span className="state-label">{item.key}:</span>
          <span className="state-value" ref={item.valueRef}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
