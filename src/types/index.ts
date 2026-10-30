export type VerificationScenario = 'SUCCESS' | 'FAIL' | 'TIMEOUT';

export type SimSwapScenario = 'SAFE' | 'SWAPPED_RECENT' | 'SWAPPED_OLD' | 'ERROR';

export interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST';
  endpoint: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestPayload?: any;
  responsePayload?: any;
  statusCode: number;
  durationMs: number;
  statusText: string;
}

export interface TestCase {
  id: string;
  code: string;
  title: string;
  description: string;
  phoneNumber: string;
  verifyScenario: VerificationScenario;
  simSwapScenario: SimSwapScenario;
  expectedResult: string;
  badge: 'NORMAL' | 'RISK' | 'FALLBACK';
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'IN' | 'OUT';
  icon: string;
}

