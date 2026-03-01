'use client';

import React from 'react';
import { useTheme } from '../ThemeProvider';
import { IconButton, SunIcon, MoonIcon } from '../ui';

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      className="floating-theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <SunIcon size={22} /> : <MoonIcon size={22} />}
    </IconButton>
  );
}
