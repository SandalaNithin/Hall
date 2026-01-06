import { X, Mail, Phone, Calendar, Users, MapPin, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerDetailPanel({ customer, onClose }) {
    if (!customer) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-white h-full w-full md:w-[600px] shadow-2xl overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">Customer Details</h2>
                            <p className="text-sm text-slate-500 font-medium">Complete booking information</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                            <X size={20} className="text-slate-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="space-y-8">
                            {/* Customer Header */}
                            <div className="bg-gradient-to-br from-primary-500 to-indigo-500 rounded-[32px] p-8 text-white">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl font-black mb-6 border-2 border-white/30">
                                    {customer.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <h3 className="text-3xl font-black mb-2">{customer.name}</h3>
                                <div className="flex items-center gap-2 text-white/80 text-sm font-bold">
                                    <CheckCircle2 size={16} />
                                    <span>Confirmed Booking</span>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Information</h4>
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                                    <DetailRow icon={<Mail size={20} />} label="Email Address" value={customer.email} />
                                    <div className="h-px bg-slate-200" />
                                    <DetailRow icon={<Phone size={20} />} label="Phone Number" value={customer.phone} />
                                </div>
                            </div>

                            {/* Booking Information */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Booking Information</h4>
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                                    <DetailRow
                                        icon={<Calendar size={20} />}
                                        label="Check-in Date"
                                        value={format(parseISO(customer.fromDate), "MMMM d, yyyy")}
                                        highlight
                                    />
                                    <div className="h-px bg-slate-200" />
                                    <DetailRow
                                        icon={<Calendar size={20} />}
                                        label="Check-out Date"
                                        value={format(parseISO(customer.toDate), "MMMM d, yyyy")}
                                        highlight
                                    />
                                    <div className="h-px bg-slate-200" />
                                    <DetailRow
                                        icon={<Clock size={20} />}
                                        label="Time"
                                        value={`${customer.checkIn || "N/A"} - ${customer.checkOut || "N/A"}`}
                                    />
                                    <div className="h-px bg-slate-200" />
                                    <DetailRow
                                        icon={<Users size={20} />}
                                        label="Number of Guests"
                                        value={`${customer.guests} Attendees`}
                                    />
                                    {customer.eventType && (
                                        <>
                                            <div className="h-px bg-slate-200" />
                                            <DetailRow
                                                icon={<MapPin size={20} />}
                                                label="Event Type"
                                                value={customer.eventType}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Special Requests */}
                            {customer.message && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Special Requests</h4>
                                    <div className="bg-slate-50 rounded-3xl p-6">
                                        <div className="flex gap-4">
                                            <MessageSquare className="text-slate-400 shrink-0" size={20} />
                                            <p className="text-slate-700 font-medium leading-relaxed">{customer.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Booking Status */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Information</h4>
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                                    <DetailRow
                                        icon={<CheckCircle2 size={20} />}
                                        label="Status"
                                        value={
                                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-black uppercase">
                                                {customer.status}
                                            </span>
                                        }
                                    />
                                    {customer.confirmedAt && (
                                        <>
                                            <div className="h-px bg-slate-200" />
                                            <DetailRow
                                                icon={<Calendar size={20} />}
                                                label="Confirmed On"
                                                value={format(parseISO(customer.confirmedAt), "MMMM d, yyyy 'at' h:mm a")}
                                            />
                                        </>
                                    )}
                                    <div className="h-px bg-slate-200" />
                                    <DetailRow
                                        icon={<Clock size={20} />}
                                        label="Booking Created"
                                        value={format(parseISO(customer.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                                    />
                                </div>
                            </div>

                            {/* Booking ID */}
                            <div className="bg-slate-100 rounded-2xl p-4 text-center">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Booking ID</div>
                                <div className="text-sm font-mono font-bold text-slate-600">{customer._id}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function DetailRow({ icon, label, value, highlight }) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-slate-400 shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
                <div className={`font-bold ${highlight ? "text-primary-600" : "text-slate-700"}`}>
                    {typeof value === "string" ? value : value}
                </div>
            </div>
        </div>
    );
}
