import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Editor System Design - Prosemirror",
  description: "Interactive demonstrations for frontend system design: Prosemirror core concepts (schema, state, transforms, view, positions, plugins) and rich text editor fundamentals (rendering, contentEditable, selection, state models, update loops, node structures).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
