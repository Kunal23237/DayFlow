import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, CalendarCheck, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
    // Mock data
    const stats = [
        { label: 'Total Employees', value: '124', icon: Users, color: 'text-blue-500' },
        { label: 'On Leave Today', value: '8', icon: CalendarCheck, color: 'text-orange-500' },
        { label: 'Avg. Attendance', value: '96%', icon: Clock, color: 'text-green-500' },
        { label: 'Pending Requests', value: '12', icon: AlertCircle, color: 'text-red-500' },
    ];

  return (
    <>
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
                <Button>Download Report</Button>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.label}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            +2.1% from last month
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Employee check-ins and leave requests.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     {/* Placeholder for table/list */}
                     <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs">User</div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">Employee Name {i}</p>
                                    <p className="text-xs text-muted-foreground">Checked in at 9:0{i} AM</p>
                                </div>
                                <div className="text-sm text-muted-foreground">Just now</div>
                            </div>
                        ))}
                     </div>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                 <CardHeader>
                    <CardTitle>Upcoming Leaves</CardTitle>
                    <CardDescription>
                        Approved leaves for this week.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                     {/* Placeholder for list */}
                       <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">John Doe {i}</p>
                                    <p className="text-xs text-muted-foreground">Sick Leave • 2 days</p>
                                </div>
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                    Approved
                                </span>
                            </div>
                        ))}
                     </div>
                 </CardContent>
            </Card>
        </div>
    </>
  );
};

export default DashboardPage;
