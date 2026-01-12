import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resetPassword as resetPasswordAPI } from "../util/axios";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Call API to reset password
            await resetPasswordAPI(email, otp, password);

            // Show success popup
            setShowSuccess(true);

            // Navigate to login after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            console.error("Password reset error:", err);
            const errorMsg = err.response?.data?.message || "Failed to update password. Please try again.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (!password) return { label: "", color: "" };
        if (password.length < 6) return { label: "Weak", color: "text-red-500" };
        if (password.length < 10) return { label: "Medium", color: "text-yellow-500" };
        return { label: "Strong", color: "text-green-500" };
    };

    const strength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

            {/* Success Popup */}
            <AnimatePresence>
                {showSuccess && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9998]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <CheckCircle2 className="text-green-600" size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Password Updated!</h3>
                                <p className="text-slate-600 font-medium">
                                    Your password has been successfully updated. Redirecting to login...
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
                {/* Header */}
                <div className="relative bg-primary-600 px-8 py-10 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />

                    <button
                        onClick={() => navigate("/verify-otp", { state: { email } })}
                        className="absolute top-5 left-5 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="relative flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/30 shadow-xl">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Create New Password</h2>
                        <p className="text-primary-100/80 mt-1 font-medium text-sm">Enter your new password</p>
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 pt-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-sm font-semibold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Enter Your Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {password && (
                                <p className={`text-xs font-semibold ml-1 ${strength.color}`}>
                                    Password Strength: {strength.label}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Re-enter Your Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && password === confirmPassword && (
                                <p className="text-xs font-semibold ml-1 text-green-600">
                                    ✓ Passwords match
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group bg-slate-900 overflow-hidden text-white py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(15,23,42,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <span>Update Password</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="h-px w-8 bg-slate-200" />
                        <span>Secure Password Reset</span>
                        <span className="h-px w-8 bg-slate-200" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
