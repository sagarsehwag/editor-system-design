'use client';

import React from 'react';

type TabsProps = {
  children: React.ReactNode;
  className?: string;
};

type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

type TabProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: React.ReactNode;
};

type TabPanelProps = {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Tabs({ children, className = '' }: TabsProps) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`prosemirror-tabs ${className}`.trim()}>{children}</div>
  );
}

export function Tab({
  active = false,
  children,
  className = '',
  ...props
}: TabProps) {
  return (
    <button
      type="button"
      className={`prosemirror-tab ${active ? 'active' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabPanel({
  active = false,
  children,
  className = '',
}: TabPanelProps) {
  if (!active) return null;
  return <div className={className}>{children}</div>;
}
