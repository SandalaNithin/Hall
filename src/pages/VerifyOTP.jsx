import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, ArrowRight, ArrowLeft, RotateCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { verifyOTP as verifyOTPAPI, requestPasswordReset } from "../util/axios";

export default function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            setError("Please enter the verification code");
            return;
        }
        if (otp.length !== 6) {
            setError("Verification code must be 6 digits");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Call API to verify OTP
            await verifyOTPAPI(email, otp);

            // Navigate to reset password screen on success
            navigate("/reset-password", { state: { email, otp } });
        } catch (err) {
            console.error("OTP verification error:", err);
            const errorMsg = err.response?.data?.message || "Invalid verification code. Please try again.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        setResendMessage("");

        try {
            // Call API to resend OTP
            await requestPasswordReset(email);
            setResendMessage("Verification code resent successfully!");
            setTimeout(() => setResendMessage(""), 3000);
        } catch (err) {
            console.error("Resend OTP error:", err);
            setError("Failed to resend code. Please try again.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

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
                        onClick={() => navigate("/forgot-password")}
                        className="absolute top-5 left-5 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="relative flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/30 shadow-xl">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Verify Code</h2>
                        <p className="text-primary-100/80 mt-1 font-medium text-sm text-center">
                            Enter the 6-digit code sent to
                        </p>
                        <p className="text-white/90 font-semibold text-sm mt-1">{email}</p>
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

                        {resendMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-green-50 border border-green-100 p-4 rounded-xl text-green-600 text-sm font-semibold"
                            >
                                {resendMessage}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                    setOtp(value);
                                    setError("");
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-2xl text-center tracking-[0.5em] text-slate-700"
                            />
                            <p className="text-xs text-slate-500 ml-1 mt-2">
                                Please check your email for the verification code
                            </p>
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
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify Code</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="w-full text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {resending ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Resending...</span>
                                </>
                            ) : (
                                <>
                                    <RotateCw size={16} />
                                    <span>Resend Code</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="h-px w-8 bg-slate-200" />
                        <span>Secure Verification</span>
                        <span className="h-px w-8 bg-slate-200" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
