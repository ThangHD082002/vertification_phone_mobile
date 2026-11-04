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

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'IN' | 'OUT';
  icon: string;
}
