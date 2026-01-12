import { useState } from "react";
import { X, Lock, Mail, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminLogin } from "../util/axios";

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, onForgotPassword }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!formData.email || !formData.password) {
            setError("Please enter both email and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await adminLogin(formData);

            if (response.data.success) {
                localStorage.setItem("adminAuth", JSON.stringify({
                    email: response.data.data.email,
                    role: response.data.data.role,
                    loginTime: new Date().toISOString(),
                    token: response.data.token // Assuming token is returned for industry level security
                }));

                onLoginSuccess();
                setFormData({ email: "", password: "" });
                onClose();
            }
        } catch (err) {
            console.error("Login error:", err);
            const errorMsg = err.response?.data?.message || "Invalid credentials. Access denied.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: "", password: "" });
        setError("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Professional Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-white-md z-[9998]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
                        >
                            {/* Decorative Header Area */}
                            <div className="relative bg-primary-600 px-8 py-10 text-white overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

                                <button
                                    onClick={handleClose}
                                    className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="relative flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/30 shadow-xl">
                                        <ShieldCheck className="text-white" size={32} />
                                    </div>
                                    <h2 className="text-3xl font-extrabold tracking-tight">Admin Portal</h2>
                                    <p className="text-primary-100/80 mt-1 font-medium italic text-sm">Secure Management System</p>
                                </div>
                            </div>

                            {/* Login Form */}
                            <div className="px-8 pt-8 pb-10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600"
                                            >
                                                <AlertCircle className="shrink-0" size={18} />
                                                <p className="text-sm font-semibold leading-tight">{error}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="admin@lakshmi hall.com"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Access Password
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                        <div className="mt-4 text-end">
                                        <button
                                            type="button"
                                            onClick={onForgotPassword}
                                            className="text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group bg-slate-900 overflow-hidden text-white py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(15,23,42,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                <span>Authenticate Access</span>
                                            </>
                                        )}
                                    </button>

                                    
                                </form>

                                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="h-px w-8 bg-slate-200" />
                                    <span>Secure Environment</span>
                                    <span className="h-px w-8 bg-slate-200" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
