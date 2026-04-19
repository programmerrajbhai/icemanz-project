import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <img src="/logo.png" alt="ICEMANZ Logo" className="h-14 mx-auto object-contain mb-4" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 font-medium">Sign in to your admin dashboard</p>
          </div>

          <form action={login} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@icemanz.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#004a99] hover:bg-[#003d80] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200 hover:shadow-blue-900/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600/50 cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
        
        <div className="py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs font-semibold text-slate-400">Secured by Supabase Auth</p>
        </div>
      </div>
    </div>
  )
}
