'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Undo2,
  Redo2,
} from 'lucide-react';

type IconProps = {
  size?: number;
  className?: string;
};

const defaultSize = 20;

export function SunIcon(props: IconProps) {
  return <Sun size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function MoonIcon(props: IconProps) {
  return <Moon size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function MenuIcon(props: IconProps) {
  return <Menu size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function CloseIcon(props: IconProps) {
  return <X size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function ChevronLeftIcon(props: IconProps) {
  return <ChevronLeft size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function ChevronRightIcon(props: IconProps) {
  return <ChevronRight size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function FullscreenIcon(props: IconProps) {
  return <Maximize2 size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function FullscreenExitIcon(props: IconProps) {
  return <Minimize2 size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function BoldIcon(props: IconProps) {
  return <Bold size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function ItalicIcon(props: IconProps) {
  return <Italic size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function UndoIcon(props: IconProps) {
  return <Undo2 size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}

export function RedoIcon(props: IconProps) {
  return <Redo2 size={props.size ?? defaultSize} className={props.className ?? ''} strokeWidth={2} aria-hidden />;
}
