'use client';

export default function SettingsClient() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your application settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Settings Panel</h2>
            <p className="text-slate-600">Application settings will be available here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
