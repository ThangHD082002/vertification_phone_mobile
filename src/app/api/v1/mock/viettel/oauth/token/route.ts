import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'MOCK_API_REMOVED', message: 'Mock API đã được xóa bỏ hoàn toàn. Ứng dụng đã chuyển sang gọi trực tiếp Viettel Open Gateway.' },
    { status: 410 }
  );
}
