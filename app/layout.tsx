import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sagarsehwag.github.io/editor-system-design"),
  title: "Editor Mechanics · ProseMirror",
  description:
    "How ProseMirror and rich text editors work. Interactive demos for schema, state, transforms, view, positions, plugins, contentEditable, selection, state models, and more.",
  openGraph: {
    title: "Editor Mechanics · ProseMirror",
    description:
      "How ProseMirror and rich text editors work. Interactive demos for schema, state, transforms, and more.",
    images: [
      {
        url: "/editor-mechanics-og.png",
        width: 1200,
        height: 630,
        alt: "Editor Mechanics · ProseMirror - How ProseMirror and rich text editors work",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editor Mechanics · ProseMirror",
    description:
      "How ProseMirror and rich text editors work. Interactive demos for schema, state, transforms, and more.",
    images: ["/editor-mechanics-og.png"],
  },
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
