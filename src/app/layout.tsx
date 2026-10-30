import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MockProvider } from '@/context/MockContext';
import { DevFloatingButton } from '@/components/DevFloatingButton';

export const metadata: Metadata = {
  title: 'ABC Bank - CAMARA Network API & SIM Swap Demo',
  description: 'Demo ứng dụng Mobile Banking kiểm thử CAMARA Number Verification và SIM Swap API',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B111E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#05080F] text-slate-100 antialiased font-sans">
        <MockProvider>
          <div className="min-h-screen bg-[#05080F] flex justify-center">
            {/* Mobile Viewport Container */}
            <main className="w-full max-w-[430px] min-h-screen bg-[#0B111E] sm:border-x sm:border-[#1E293B] shadow-2xl relative flex flex-col overflow-x-hidden">
              {children}
              <DevFloatingButton />
            </main>
          </div>
        </MockProvider>
      </body>
    </html>
  );
}
