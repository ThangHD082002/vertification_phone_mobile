import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectUri = searchParams.get('redirect_uri') || '';
  const state = searchParams.get('state') || '';
  const autoApprove = searchParams.get('auto_approve') === 'true';

  const authCode = 'vtt_code_' + Math.random().toString(36).substring(2, 18);
  const delimiter = redirectUri.includes('?') ? '&' : '?';
  const callbackUrl = `${redirectUri}${delimiter}code=${authCode}${state ? `&state=${encodeURIComponent(state)}` : ''}`;
  const rejectUrl = `${redirectUri}${delimiter}error=access_denied${state ? `&state=${encodeURIComponent(state)}` : ''}`;

  if (autoApprove) {
    return NextResponse.redirect(callbackUrl);
  }

  // Giao diện Consent chuẩn Viettel Open Gateway giống hệt bản Java Spring Boot
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
    <title>Viettel - Chia sẻ dữ liệu</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0b111e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 16px;
        }
        .modal-card {
            background: #ffffff;
            border-radius: 20px;
            width: 100%;
            max-width: 380px;
            padding: 28px 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            text-align: center;
        }
        .logo {
            color: #ee0033;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
            line-height: 1.4;
        }
        .subtitle {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .badge-group {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 20px;
        }
        .badge {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            color: #334155;
            font-size: 12px;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 8px;
        }
        .terms {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .terms a {
            color: #ee0033;
            text-decoration: underline;
            font-weight: 600;
        }
        .btn-approve {
            display: block;
            width: 100%;
            background: #ee0033;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            padding: 14px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            margin-bottom: 12px;
            box-shadow: 0 4px 12px rgba(238, 0, 51, 0.3);
            transition: background 0.2s;
        }
        .btn-approve:hover {
            background: #cc002c;
        }
        .btn-reject {
            display: block;
            width: 100%;
            background: transparent;
            color: #64748b;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
        }
        .btn-reject:hover {
            background: #f8fafc;
        }
    </style>
</head>
<body>
    <div class="modal-card">
        <div class="logo">viettel</div>
        <h2 class="title">Chia sẻ dữ liệu với Number Verification Application</h2>
        <p class="subtitle">Bạn đang cho phép <strong>Number Verification Application</strong> sử dụng dịch vụ xác thực thuê bao:</p>

        <div class="badge-group">
            <div class="badge">Xác minh số điện thoại</div>
            <div class="badge">Chia sẻ số điện thoại</div>
        </div>

        <p class="terms">
            Để tiếp tục sử dụng dịch vụ, Viettel sẽ chia sẻ thông tin số điện thoại của bạn với <strong>ABC Bank</strong>.<br/><br/>
            Xem <a href="#">Chính sách quyền riêng tư</a> và <a href="#">Điều khoản dịch vụ</a>.
        </p>

        <a href="${callbackUrl}" class="btn-approve">✓ Đồng ý & Xác thực</a>
        <a href="${rejectUrl}" class="btn-reject">✕ Từ chối</a>
    </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
