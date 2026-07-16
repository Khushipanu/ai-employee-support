import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

export const metadata = {
  title: "ai-employee-support",
  description: "AI-powered employee support: chat assistant, HR & IT tickets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
