import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Clock,
    Banknote,
    LogOut,
    Menu,
    X,
    Bell,
    CheckSquare
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href, collapsed, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === href;

    return (
        <Link
            to={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm font-medium fade-in-0 duration-200">{label}</span>}
        </Link>
    );
};

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    // Determine base path based on role or current URL to support aliases
    // Determine base path based on role or current URL to support aliases
    const isAdmin = ['admin', 'hr'].includes(user?.role?.toLowerCase());
    const basePath = isAdmin ? '/admin-dashboard' : '/employee-dashboard';

    const employeeNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/employee-dashboard' },
        { icon: Users, label: 'My Profile', href: '/employee-dashboard/employees' },
        { icon: Calendar, label: 'My Attendance', href: '/employee-dashboard/attendance' },
        { icon: Clock, label: 'Leave Request', href: '/employee-dashboard/leave' },
        { icon: Banknote, label: 'My Payslips', href: '/employee-dashboard/payroll' },
    ];

    const adminNavItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/admin-dashboard' },
        { icon: Users, label: 'All Employees', href: '/admin-dashboard/employees' },
        { icon: Users, label: 'My Profile', href: '/admin-dashboard/profile' }, // Added Profile Link
        { icon: CheckSquare, label: 'Leave Approvals', href: '/admin-dashboard/leave' },
        { icon: Clock, label: 'Attendance Logs', href: '/admin-dashboard/attendance' },
        { icon: Banknote, label: 'Payroll Processing', href: '/admin-dashboard/payroll' },
    ];

    const navItems = isAdmin ? adminNavItems : employeeNavItems;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar for Desktop */}
            <aside
                className={cn(
                    "hidden md:flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                <div className="h-14 flex items-center px-4 border-b shrink-0">
                    <div className="flex items-center gap-2 font-bold text-lg text-primary">
                        <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center">D</div>
                        {!collapsed && <span className="truncate">DayFlow {isAdmin && '(Admin)'}</span>}
                    </div>
                </div>

                <div className="flex-1 py-4 px-2 space-y-1 overflow-auto">
                    {navItems.map((item) => (
                        <SidebarItem key={item.href} {...item} collapsed={collapsed} />
                    ))}
                </div>

                <div className="p-2 border-t space-y-2">
                    <Button variant="ghost" size="icon" onClick={toggleCollapse} className="w-full justify-center">
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 border-b bg-card flow-root flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold md:hidden">DayFlow</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
                            {isAdmin ? 'HR Management Console' : 'Employee Portal'}
                        </div>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
                        <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-card border-r p-4 shadow-lg animate-in slide-in-from-left">
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-xl">DayFlow</span>
                                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <SidebarItem
                                        key={item.href}
                                        {...item}
                                        onClick={() => setMobileMenuOpen(false)}
                                        collapsed={false}
                                    />
                                ))}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive mt-4"
                                    onClick={logout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 space-y-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
