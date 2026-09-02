import { login } from './actions'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error;

  const inputClasses = "py-3 px-4 ps-11 block w-full border border-gray-200 rounded-sm text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white font-medium text-slate-900";
  const iconWrapperClasses = "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4";
  const iconClasses = "flex-shrink-0 size-4 text-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-sm shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <img src="/logo.png" alt="ICEMANZ Logo" className="h-14 mx-auto object-contain mb-4" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 font-medium">Sign in to your admin dashboard</p>
          </div>

          <form action={login} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-sm text-sm font-medium text-red-600 text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  defaultValue=""
                  className={inputClasses}
                />
                <div className={iconWrapperClasses}>
                  <Mail className={iconClasses} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  defaultValue=""
                  className={inputClasses}
                />
                <div className={iconWrapperClasses}>
                  <Lock className={iconClasses} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#004a99] hover:bg-[#003d80] text-white font-bold rounded-sm shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-blue-900/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600/50 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Admin login credentials: admin@gmail.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
