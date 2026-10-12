import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "CampusStudy",
  description: "Organiza tus materias, tareas y grupos de estudio en un solo lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          duration={3000}
          toastOptions={{
            style: {
              background: "#121A2B",
              color: "#F5EFE3",
              border: "1px solid rgba(232, 163, 61, 0.35)",
              borderRadius: "12px",
              padding: "16px 20px",
              fontSize: "15px",
              fontWeight: 500,
              fontFamily: "var(--font-geist-sans)",
              boxShadow: "0 12px 32px rgba(18, 26, 43, 0.35)",
            },
            classNames: {
              icon: "!text-[#E8A33D]",
            },
          }}
        />
      </body>
    </html>
  );
}