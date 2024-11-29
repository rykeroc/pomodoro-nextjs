import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Montserrat} from 'next/font/google'
import clsx from "clsx";

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Focus Cafe",
  description: "Pomodoro timer app to manage focus duration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(montserrat.className, 'antialiased')}>
        {children}
      </body>
    </html>
  );
}
