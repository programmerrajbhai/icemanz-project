import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Construction } from 'lucide-react';

export default function CompletedProjectsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-20">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Minimal Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 text-primary mb-10 shadow-sm">
                            <Construction size={32} />
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
                            Coming <span className="text-primary">Soon</span>
                        </h1>

                        {/* Simple Animated Indicator */}
                        <div className="mt-12 w-24 h-1.5 bg-slate-100 mx-auto rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-primary rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
