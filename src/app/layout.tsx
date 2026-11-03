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
    <html lang="vi">
      <body className="bg-[#E4E8F0] text-slate-800 antialiased font-sans">
        <MockProvider>
          <div className="min-h-screen bg-[#E4E8F0] flex justify-center">
            {/* Mobile Viewport Container - Viettel Light Theme */}
            <main className="w-full max-w-[430px] min-h-screen bg-[#F4F6FA] sm:border-x sm:border-slate-200/80 shadow-2xl relative flex flex-col overflow-x-hidden text-slate-800">
              {children}
            </main>
          </div>
        </MockProvider>
      </body>
    </html>
  );
}
