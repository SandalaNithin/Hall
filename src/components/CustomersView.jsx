import { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, Loader2, AlertCircle, ChevronRight, User, MapPin } from "lucide-react";
import { getConfirmedBookings } from "../util/axios";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

export default function CustomersView({ onSelectCustomer, searchTerm = "" }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchConfirmedCustomers();
    }, []);

    const fetchConfirmedCustomers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getConfirmedBookings();
            setCustomers(response.data.data || []);
        } catch (err) {
            console.error("Error fetching confirmed customers:", err);
            setError("Failed to load confirmed customers");
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        (customer.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (customer.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (customer.phone || "").includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-primary-500" size={48} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Customers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 flex items-center gap-4">
                <AlertCircle className="text-red-500" size={32} />
                <div>
                    <h3 className="text-lg font-black text-red-700">Error Loading Customers</h3>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">Confirmed Customers</h2>
                    <p className="text-slate-500 font-medium">
                        {customers.length} total customer{customers.length !== 1 ? "s" : ""}
                        {searchTerm && ` • ${filteredCustomers.length} matching search`}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Users size={24} />}
                    label="Total Customers"
                    value={customers.length}
                    color="primary"
                />
                <StatCard
                    icon={<Calendar size={24} />}
                    label="Active Bookings"
                    value={customers.filter(c => new Date(c.toDate) >= new Date()).length}
                    color="green"
                />
                <StatCard
                    icon={<Users size={24} />}
                    label="Total Guests"
                    value={customers.reduce((sum, c) => sum + (c.guests || 0), 0)}
                    color="indigo"
                />
            </div>

            {/* Customers List */}
            {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 p-20 text-center border border-slate-100">
                    <div className="w-24 h-24 bg-slate-50 rounded-[32px] mx-auto flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                        <Users size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                        {searchTerm ? "No Matching Customers" : "No Confirmed Customers"}
                    </h3>
                    <p className="text-slate-400 font-medium">
                        {searchTerm ? "Try adjusting your search criteria" : "Confirmed customers will appear here"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer) => (
                        <CustomerCard
                            key={customer._id}
                            customer={customer}
                            onClick={() => onSelectCustomer(customer)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CustomerCard({ customer, onClick }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-3xl border-2 border-slate-100 p-6 cursor-pointer hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100/30 transition-all group"
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {customer.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-1">{customer.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Confirmed
                        </div>
                    </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" size={20} />
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-slate-400" size={16} />
                    <span className="text-slate-600 font-medium truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Phone className="text-slate-400" size={16} />
                    <span className="text-slate-600 font-medium">{customer.phone}</span>
                </div>
            </div>

            {/* Booking Details */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={14} />
                        <span>Booking Date</span>
                    </div>
                </div>
                <div className="text-sm font-bold text-primary-600">
                    {format(parseISO(customer.fromDate), "MMM d")} - {format(parseISO(customer.toDate), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users size={14} />
                        <span className="font-bold">{customer.guests} Guests</span>
                    </div>
                    {customer.eventType && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin size={14} />
                            <span className="font-bold">{customer.eventType}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        primary: "bg-primary-50 text-primary-600 border-primary-100",
        green: "bg-green-50 text-green-600 border-green-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
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
