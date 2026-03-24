import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import Link from 'next/link';
import { 
  Construction, 
  ArrowLeft, 
  Timer, 
  Settings, 
  Wrench,
  ShieldCheck
} from 'lucide-react';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // Format the slug for display
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900">{title}</span>
            </nav>

            {/* Main Content Card */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
              <div className="p-8 md:p-16 text-center">
                {/* Icon Animation */}
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-primary/30">
                    <Construction size={48} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                    <Timer size={20} />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">
                  {title}
                </h1>
                
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-bold text-sm mb-8 uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  Coming Soon
                </div>

                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12">
                  We are currently updating our inventory for <span className="font-bold text-slate-900">{title}</span>. 
                  Our team is working hard to bring you the best commercial refrigeration solutions in the industry.
                </p>

                {/* Features Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <div className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <Settings className="text-primary group-hover:rotate-90 transition-transform duration-500" size={32} />
                    <span className="font-bold text-slate-900">Custom Specs</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <ShieldCheck className="text-primary group-hover:scale-110 transition-transform" size={32} />
                    <span className="font-bold text-slate-900">Certified Quality</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <Wrench className="text-primary group-hover:-translate-y-1 transition-transform" size={32} />
                    <span className="font-bold text-slate-900">Expert Support</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                    <ArrowLeft size={20} /> Back to Home
                  </Link>
                  <Link href="/quote" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                    Get a Quote Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </main>
  );
}
