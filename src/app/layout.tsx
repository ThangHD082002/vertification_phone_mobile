import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MockProvider } from '@/context/MockContext';

export const metadata: Metadata = {
  title: 'Viettel Money - Xác thực & Bảo vệ giao dịch Viettel Open Gateway',
  description: 'Trải nghiệm ngân hàng số Viettel Money bảo vệ bởi Viettel Open Gateway (Number Verification & SIM Swap)',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#EE0033',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#06080D] text-slate-100 antialiased font-sans">
        <MockProvider>
          <div className="min-h-screen bg-[#06080D] flex justify-center">
            {/* Mobile Viewport Container */}
            <main className="w-full max-w-[430px] min-h-screen bg-[#0D1017] sm:border-x sm:border-[#1F2430] shadow-2xl relative flex flex-col overflow-x-hidden">
              {children}
            </main>
          </div>
        </MockProvider>
      </body>
    </html>
  );
}
