import { ShieldCheck, ChevronRight } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

function LandingPage({ showLoginModal, setShowLoginModal, onLoginSuccess }) {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-2xl w-full text-center space-y-12">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-2xl">
                        <ShieldCheck className="text-primary-400" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Internal Security Protocol Active</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                        Lakshmi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Portal</span>
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                        Efficient Reservation Management System.
                        Designed for efficiency, built for scale.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="group relative px-10 py-5 bg-white text-slate-900 rounded-[20px] font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-3 overflow-hidden"
                    >
                        <span className="relative z-10">Access System</span>
                        <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                        <span className="h-px w-8 bg-slate-800" />
                        <span>Administrative Use Only</span>
                        <span className="h-px w-8 bg-slate-800" />
                    </div>
                </div>
            </div>

            <AdminLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={onLoginSuccess}
            />
        </div>
    );
}

export default LandingPage;
