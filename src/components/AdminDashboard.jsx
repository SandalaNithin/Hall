import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Users,
    Mail,
    Phone,
    AlertCircle,
    Loader2,
    LogOut,
    LayoutDashboard,
    Filter,
    Search,
    ChevronRight,
    User,
    MapPin,
    MessageSquare,
    Menu,
    X
} from "lucide-react";
import {
    getPendingBookings,
    confirmBooking,
    rejectBooking,
    getAllBookings
} from "../util/axios";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import CalendarView from "./CalendarView";
import CustomersView from "./CustomersView";
import CustomerDetailPanel from "./CustomerDetailPanel";

export default function AdminDashboard({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved ? JSON.parse(saved) : false;
    });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        const adminAuth = localStorage.getItem("adminAuth");
        if (!adminAuth) {
            navigate("/");
            return;
        }

        try {
            const authData = JSON.parse(adminAuth);
            setAdminEmail(authData.email);
        } catch (err) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    // Clear search when switching views
    useEffect(() => {
        setSearchTerm("");
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        onLogout();
    };

    useEffect(() => {
        if (location.pathname === "/dashboard" || location.pathname === "/dashboard/overview") {
            fetchBookings();
        }
    }, [filter, location.pathname]);

    const fetchBookings = async () => {
        setLoading(true);
        setError("");
        try {
            let response;
            if (filter === "pending") {
                response = await getPendingBookings();
            } else {
                response = await getAllBookings(filter === "all" ? undefined : filter);
            }
            setBookings(response.data.data);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Unable to sync with master database. Retrying...");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (bookingId) => {
        if (!window.confirm("Confirm this booking? Notification emails will be dispatched.")) return;
        setActionLoading(bookingId);
        try {
            const response = await confirmBooking(bookingId);
            setSuccess(response.data.message);
            await fetchBookings();
            setTimeout(() => setSuccess(""), 5000);
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
            setTimeout(() => setError(""), 5000);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (bookingId) => {
        const reason = window.prompt("Reason for rejection (sent to customer):", "Capacity limitations");
        if (!reason) return;
        setActionLoading(bookingId);
        try {
            const response = await rejectBooking(bookingId, reason);
            setSuccess(response.data.message);
            await fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredBookings = bookings.filter(b =>
        (b.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (b.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (b.phone || "").includes(searchTerm)
    );

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const currentPath = location.pathname;
    const isOverview = currentPath === "/dashboard" || currentPath === "/dashboard/overview";
    const isCalendar = currentPath === "/dashboard/calendar";
    const isCustomers = currentPath === "/dashboard/customers";

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200 sticky top-0 h-screen transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-72"
                }`}>
                <div className="p-8">
                    <div className={`flex items-center gap-3 mb-10 ${sidebarCollapsed ? "justify-center" : ""}`}>
                        <div className="bg-primary-600 p-2 rounded-xl shadow-lg ring-4 ring-primary-50">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        {!sidebarCollapsed && (
                            <h1 className="text-xl font-black tracking-tight text-slate-800">FH Admin</h1>
                        )}
                    </div>

                    <nav className="space-y-1">
                        <NavItem
                            active={isOverview}
                            icon={<LayoutDashboard size={20} />}
                            label="Overview"
                            collapsed={sidebarCollapsed}
                            onClick={() => navigate("/dashboard/overview")}
                        />
                        <NavItem
                            active={isCalendar}
                            icon={<Calendar size={20} />}
                            label="Calendar"
                            collapsed={sidebarCollapsed}
                            onClick={() => navigate("/dashboard/calendar")}
                        />
                        <NavItem
                            active={isCustomers}
                            icon={<Users size={20} />}
                            label="Customers"
                            collapsed={sidebarCollapsed}
                            onClick={() => navigate("/dashboard/customers")}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    {sidebarCollapsed ? (
                        <button
                            onClick={handleLogout}
                            className="w-full p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold overflow-hidden">
                                {adminEmail ? adminEmail[0].toUpperCase() : <User size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-slate-700">{adminEmail ? adminEmail.split('@')[0] : 'Admin'}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">System Admin</p>
                            </div>
                            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 lg:hidden flex flex-col"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary-600 p-2 rounded-xl shadow-lg ring-4 ring-primary-50">
                                            <LayoutDashboard className="text-white" size={24} />
                                        </div>
                                        <h1 className="text-xl font-black tracking-tight text-slate-800">FH Admin</h1>
                                    </div>
                                    <button
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <nav className="space-y-1">
                                    <NavItem
                                        active={isOverview}
                                        icon={<LayoutDashboard size={20} />}
                                        label="Overview"
                                        onClick={() => {
                                            navigate("/dashboard/overview");
                                            setMobileSidebarOpen(false);
                                        }}
                                    />
                                    <NavItem
                                        active={isCalendar}
                                        icon={<Calendar size={20} />}
                                        label="Calendar"
                                        onClick={() => {
                                            navigate("/dashboard/calendar");
                                            setMobileSidebarOpen(false);
                                        }}
                                    />
                                    <NavItem
                                        active={isCustomers}
                                        icon={<Users size={20} />}
                                        label="Customers"
                                        onClick={() => {
                                            navigate("/dashboard/customers");
                                            setMobileSidebarOpen(false);
                                        }}
                                    />
                                </nav>
                            </div>

                            <div className="mt-auto p-6 border-t border-slate-100">
                                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold overflow-hidden">
                                        {adminEmail ? adminEmail[0].toUpperCase() : <User size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-slate-700">{adminEmail ? adminEmail.split('@')[0] : 'Admin'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">System Admin</p>
                                    </div>
                                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Top Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={() => {
                                if (window.innerWidth < 1024) {
                                    setMobileSidebarOpen(true);
                                } else {
                                    toggleSidebar();
                                }
                            }}
                            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <Menu size={20} />
                        </button>

                        {/* Search Field - Always visible */}
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder={
                                    isCalendar ? "Search calendar..." :
                                        isCustomers ? "Search customers..." :
                                            "Search bookings..."
                                }
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-4">
                        <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block" />
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 px-2 py-1 bg-slate-100 rounded-md">V1.0.5</span>
                        </div>
                    </div> */}
                </header>

                {/* Dashboard Area */}
                <div className="p-6 lg:p-10 space-y-10">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
                        <Route
                            path="/overview"
                            element={
                                <OverviewContent
                                    filter={filter}
                                    setFilter={setFilter}
                                    loading={loading}
                                    error={error}
                                    success={success}
                                    filteredBookings={filteredBookings}
                                    handleConfirm={handleConfirm}
                                    handleReject={handleReject}
                                    actionLoading={actionLoading}
                                />
                            }
                        />
                        <Route path="/calendar" element={<CalendarView searchTerm={searchTerm} />} />
                        <Route
                            path="/customers"
                            element={<CustomersView onSelectCustomer={setSelectedCustomer} searchTerm={searchTerm} />}
                        />
                    </Routes>
                </div>
            </main>

            {/* Customer Detail Panel */}
            {selectedCustomer && (
                <CustomerDetailPanel
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}
        </div>
    );
}

function NavItem({ active, icon, label, collapsed, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${active
                ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? label : ""}
        >
            {icon}
            {!collapsed && <span>{label}</span>}
            {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-glow" />}
        </button>
    );
}

function OverviewContent({ filter, setFilter, loading, error, success, filteredBookings, handleConfirm, handleReject, actionLoading }) {
    return (
        <>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        <span>Dashboard</span>
                        <ChevronRight size={12} />
                        <span className="text-primary-600">Booking Management</span>
                    </nav>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Reservations</h2>
                </div>

                <div className="flex p-1 bg-slate-200 rounded-2xl shadow-inner">
                    {["pending", "confirmed", "rejected", "all"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === tab
                                ? "bg-white text-slate-900 shadow-md"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-300"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback Messages */}
            <AnimatePresence>
                {(success || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-5 rounded-3xl border-2 flex items-center gap-4 ${success ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                            }`}
                    >
                        {success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <p className="font-bold">{success || error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Grid */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-primary-500" size={48} />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Ledger...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 p-20 text-center border border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] mx-auto flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                            <Calendar size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No Entries Found</h3>
                        <p className="text-slate-400 font-medium">There are currently no bookings matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                onConfirm={handleConfirm}
                                onReject={handleReject}
                                isLoading={actionLoading === booking._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function BookingCard({ booking, onConfirm, onReject, isLoading }) {
    const statusColors = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        rejected: "bg-rose-100 text-rose-700 border-rose-200"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500"
        >
            <div className="p-8">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                            <User size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{booking.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                <Clock size={12} />
                                <span>Booked {format(new Date(booking.createdAt), "MMM d, h:mm a")}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${statusColors[booking.status]}`}>
                        {booking.status}
                    </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
                    <InfoItem icon={<Mail size={16} />} label="Email Address" value={booking.email} />
                    <InfoItem icon={<Phone size={16} />} label="Contact Number" value={booking.phone} />
                    <InfoItem icon={<Calendar size={16} />} label="Scheduled Date" value={`${format(new Date(booking.fromDate), "MMM d")} - ${format(new Date(booking.toDate), "MMM d, yyyy")}`} highlight />
                    <InfoItem icon={<Users size={16} />} label="Total Guests" value={`${booking.guests} Attendees`} />
                </div>

                {/* Additional Detail Row */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <DetailBadge icon={<MapPin size={14} />} label={booking.eventType} />
                    <DetailBadge icon={<Clock size={14} />} label={`${booking.checkIn} - ${booking.checkOut}`} />
                </div>

                {/* Message Panel */}
                {booking.message && (
                    <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 flex gap-3">
                        <MessageSquare className="text-slate-300 shrink-0" size={18} />
                        <p className="text-sm font-medium text-slate-600 line-clamp-3">{booking.message}</p>
                    </div>
                )}

                {/* Actions */}
                {booking.status === "pending" && (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => onConfirm(booking._id)}
                            disabled={isLoading}
                            className="bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <CheckCircle size={18} />
                                    <span>Confirm</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => onReject(booking._id)}
                            disabled={isLoading}
                            className="bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <XCircle size={18} />
                                    <span>Reject</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {booking.confirmedAt && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-black uppercase tracking-widest">
                        <CheckCircle size={16} />
                        Verified on {format(new Date(booking.confirmedAt), "MMM d, yyyy")}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function InfoItem({ icon, label, value, highlight }) {
    return (
        <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                {icon}
                <span>{label}</span>
            </div>
            <p className={`text-sm font-bold truncate ${highlight ? "text-primary-600" : "text-slate-700"}`}>{value}</p>
        </div>
    );
}

function DetailBadge({ icon, label }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
            {icon}
            <span>{label}</span>
        </div>
    );
}
