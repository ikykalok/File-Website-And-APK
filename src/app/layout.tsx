import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://echomusic.fun"),
  title: "Echo Music - Free Music Streaming App for Android",
  description: "A free, modern, open-source music streaming client for Android with YouTube Music backend. Ad-free, background playback, offline caching, and Material You design.",
  keywords: ["Echo Music", "Music Player", "Android", "Free Music", "Open Source", "Streaming", "No Ads", "YouTube Music"],
  authors: [{ name: "Echo Music Team" }],
  icons: {
    icon: "/assets/favicon-frames/frame_1.png",
  },
  openGraph: {
    title: "Echo Music - Free Music Streaming App for Android",
    description: "A free, modern, open-source music streaming client for Android with YouTube Music backend. Ad-free, background playback, offline caching, and Material You design.",
    url: "https://echomusic.fun/",
    type: "website",
    images: [
      {
        url: "/assets/Echo.gif",
        alt: "Echo Music - Free Music Streaming App Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Unbounded:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/assets/favicon-frames/frame_1.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
