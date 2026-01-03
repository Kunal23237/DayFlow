import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Clock, CalendarCheck, AlertCircle, User, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Employees', value: '124', icon: Users, color: 'text-blue-500' },
        { label: 'On Leave Today', value: '8', icon: CalendarCheck, color: 'text-orange-500' },
        { label: 'Avg. Attendance', value: '96%', icon: Clock, color: 'text-green-500' },
        { label: 'Pending Requests', value: '12', icon: AlertCircle, color: 'text-red-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <Button>Download Report</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Admin Activity Feed (Placeholder) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Recent leave requests and attendance logs will appear here.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Leaves</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">List of employees on leave this week.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const EmployeeDashboard = ({ user }) => {
    const navigate = useNavigate();

    const quickActions = [
        { label: 'My Profile', icon: User, href: '/employee-dashboard/employees', desc: 'View and edit personal details' },
        { label: 'Attendance', icon: Clock, href: '/employee-dashboard/attendance', desc: 'Check logs & daily status' },
        { label: 'Leave Request', icon: CalendarCheck, href: '/employee-dashboard/leave', desc: 'Apply for leaves' },
        { label: 'Payslips', icon: FileText, href: '/employee-dashboard/payroll', desc: 'View salary details' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Employee'}!</h2>
                    <p className="text-muted-foreground">Here is what is happening with your job today.</p>
                </div>
                <div className="hidden md:block">
                    <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">{user?.role === 'admin' ? 'Administrator' : 'Employee ID: EMP-2024-001'}</span>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-all cursor-pointer border-primary/10 hover:border-primary/30 group"
                        onClick={() => navigate(action.href)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</CardTitle>
                            <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground pt-2">{action.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity / Notifications */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest attendance and leave updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <Clock className="h-5 w-5 text-green-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Checked In</p>
                                <p className="text-xs text-muted-foreground">Today at 09:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <CalendarCheck className="h-5 w-5 text-blue-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Leave Approved</p>
                                <p className="text-xs text-muted-foreground">Casual Leave for 25th Oct</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border rounded-lg bg-primary/5 border-primary/10">
                            <h4 className="font-semibold text-primary mb-1">Holiday Notice</h4>
                            <p className="text-sm text-muted-foreground">The office will remain closed on Friday for the upcoming public holiday.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { user } = useAuth();

    // Fallback if data isn't loaded yet
    if (!user) return <div className="p-8">Loading dashboard...</div>;

    return user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard user={user} />;
};

export default DashboardPage;
