'use client';

import { useState } from 'react';
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

export default function SettingsClient({ isConnected }: { isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    window.location.href = '/api/qbo/connect';
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/qbo/disconnect', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your QuickBooks Online integration and other settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ExternalLink className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">QuickBooks Online</h2>
              <p className="text-sm text-slate-500">Connect your QuickBooks account to sync invoices and payments.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                <CheckCircle2 size={16} />
                Connected
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-sm font-medium border border-slate-200">
                <XCircle size={16} />
                Disconnected
              </div>
            )}
          </div>

          {isConnected ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Your QuickBooks account is connected and synced. Invoices will be automatically sent to QuickBooks.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://app.qbo.intuit.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Go to QuickBooks
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Connect to QuickBooks to automatically sync invoices, customers, and receive payment updates.
              </p>
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="mr-2">
                  <path d="M11.964 13.441c.748.384 1.58.585 2.504.604v-1.333c-.779-.047-1.47-.292-2.075-.734-.604-.44-.955-1.009-1.053-1.706h1.002c.262 0 .456-.087.582-.261.126-.174.189-.404.189-.69V6.667c0-.286-.063-.516-.189-.69a.944.944 0 00-.582-.261H8.59V3.463h-1.199v.435c0 .311-.079.561-.238.752-.159.191-.381.286-.666.286H5.5v1.333h.714c.383 0 .689.112.918.337.229.225.343.563.343 1.013v2.334c0 .449-.114.787-.343 1.013-.229.225-.535.337-.918.337H5.5v1.333h1.995c.199.047.385.102.559.166.174.063.338.141.492.232.154.091.303.198.446.321l.049.055z" fill="#2CA01C"/>
                  <path d="M5.021 13.441c-.748.384-1.58.585-2.504.604v-1.333c.779-.047 1.47-.292 2.075-.734.604-.44.955-1.009 1.053-1.706H4.643c-.262 0-.456-.087-.582-.261a.881.881 0 01-.189-.69V6.667c0-.286.063-.516.189-.69.126-.174.32-.261.582-.261h2.242V3.463h1.199v.435c0 .311.079.561.238.752.159.191.381.286.666.286h1.002v1.333h-.714c-.383 0-.689.112-.918.337-.229.225-.343.563-.343 1.013v2.334c0 .449.114.787.343 1.013.229.225.535.337.918.337h.714v1.333h-1.995a3.24 3.24 0 01-.559.166 3.039 3.039 0 01-.492.232 3.018 3.018 0 01-.446.321l-.049.055z" fill="#2CA01C"/>
                </svg>
                {isLoading ? 'Connecting...' : 'Connect to QuickBooks'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
