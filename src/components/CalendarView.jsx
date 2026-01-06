import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, Clock, Mail, Phone, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { getPendingBookings } from "../util/axios";
import { format, parseISO, eachDayOfInterval, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarView({ searchTerm = "" }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const fetchPendingBookings = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getPendingBookings();
            setBookings(response.data.data || []);
        } catch (err) {
            console.error("Error fetching pending bookings:", err);
            setError("Failed to load pending reservations");
        } finally {
            setLoading(false);
        }
    };

    // Group bookings by date ranges
    const getDateBookings = () => {
        const dateMap = new Map();

        // Filter bookings based on search term
        const filteredBookings = bookings.filter(booking =>
            (booking.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (booking.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (booking.phone || "").includes(searchTerm)
        );

        filteredBookings.forEach(booking => {
            try {
                const fromDate = parseISO(booking.fromDate);
                const toDate = parseISO(booking.toDate);
                const dateRange = eachDayOfInterval({ start: fromDate, end: toDate });

                dateRange.forEach(date => {
                    const dateKey = format(date, "yyyy-MM-dd");
                    if (!dateMap.has(dateKey)) {
                        dateMap.set(dateKey, []);
                    }
                    dateMap.get(dateKey).push(booking);
                });
            } catch (err) {
                console.error("Error parsing booking dates:", err);
            }
        });

        return dateMap;
    };

    const dateBookings = getDateBookings();
    const sortedDates = Array.from(dateBookings.keys()).sort();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-primary-500" size={48} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Calendar...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 flex items-center gap-4">
                <AlertCircle className="text-red-500" size={32} />
                <div>
                    <h3 className="text-lg font-black text-red-700">Error Loading Calendar</h3>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 p-20 text-center border border-slate-100">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] mx-auto flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                    <CalendarIcon size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">No Pending Reservations</h3>
                <p className="text-slate-400 font-medium">All reservations have been processed.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<CalendarIcon size={24} />}
                    label="Pending Reservations"
                    value={bookings.length}
                    color="primary"
                />
                <StatCard
                    icon={<Users size={24} />}
                    label="Total Guests"
                    value={bookings.reduce((sum, b) => sum + (b.guests || 0), 0)}
                    color="indigo"
                />
                <StatCard
                    icon={<Clock size={24} />}
                    label="Date Ranges"
                    value={sortedDates.length}
                    color="amber"
                />
            </div>

            {/* Calendar Grid */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800">Reservation Calendar</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedDates.map(dateKey => {
                        const dayBookings = dateBookings.get(dateKey);
                        const totalGuests = dayBookings.reduce((sum, b) => sum + (b.guests || 0), 0);
                        const isSelected = selectedDate === dateKey;

                        return (
                            <motion.div
                                key={dateKey}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`bg-white rounded-3xl border-2 p-6 cursor-pointer transition-all ${isSelected
                                    ? "border-primary-500 shadow-2xl shadow-primary-100"
                                    : "border-slate-100 hover:border-primary-200 shadow-lg shadow-slate-200/40"
                                    }`}
                                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                            >
                                {/* Date Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-3xl font-black text-slate-800">
                                            {format(parseISO(dateKey), "d")}
                                        </div>
                                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                            {format(parseISO(dateKey), "MMM yyyy")}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${dayBookings.length > 1
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-green-100 text-green-700"
                                        }`}>
                                        {dayBookings.length > 1 ? "Multiple" : "Available"}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <Users size={16} className="text-primary-500" />
                                        <span>{dayBookings.length} Booking{dayBookings.length > 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <Users size={16} className="text-indigo-500" />
                                        <span>{totalGuests} Total Guests</span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-slate-100 pt-4 mt-4 space-y-3"
                                        >
                                            {dayBookings.map(booking => (
                                                <div
                                                    key={booking._id}
                                                    className="bg-slate-50 rounded-2xl p-4 space-y-2"
                                                >
                                                    <div className="font-black text-slate-800">{booking.name}</div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Mail size={12} />
                                                        <span className="truncate">{booking.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Phone size={12} />
                                                        <span>{booking.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-primary-600">
                                                        <CalendarIcon size={12} />
                                                        <span>
                                                            {format(parseISO(booking.fromDate), "MMM d")} - {format(parseISO(booking.toDate), "MMM d")}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        primary: "bg-primary-50 text-primary-600 border-primary-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100"
    };

    return (
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-lg shadow-slate-200/40">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border-2 ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-black text-slate-800">{value}</div>
        </div>
    );
}
