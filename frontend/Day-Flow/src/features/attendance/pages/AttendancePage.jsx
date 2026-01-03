import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
 // Assuming we might want badge styles, or just use div classes
import { Clock, Calendar as CalendarIcon, MapPin, UserCheck, UserX } from 'lucide-react';

const EmployeeAttendance = () => {
    const [status, setStatus] = useState('out'); // 'in' or 'out'

    const handleCheckInOut = () => {
        setStatus(status === 'in' ? 'out' : 'in');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Attendance</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Today's Status</CardTitle>
                        <CardDescription>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <div className={`h-40 w-40 rounded-full flex items-center justify-center border-4 ${status === 'in' ? 'border-green-500 bg-green-500/10' : 'border-slate-300 bg-slate-100 dark:bg-slate-800'} transition-all duration-500`}>
                            <div className="text-center">
                                <Clock className={`h-10 w-10 mx-auto mb-2 ${status === 'in' ? 'text-green-600' : 'text-slate-400'}`} />
                                <span className={`text-xl font-bold ${status === 'in' ? 'text-green-700' : 'text-slate-500'}`}>
                                    {status === 'in' ? 'Checked In' : 'Checked Out'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <Button
                                size="lg"
                                className={`flex-1 ${status === 'out' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 pointer-events-none'}`}
                                onClick={() => setStatus('in')}
                                disabled={status === 'in'}
                            >
                                Check In
                            </Button>
                            <Button
                                size="lg"
                                variant="destructive"
                                className="flex-1"
                                onClick={() => setStatus('out')}
                                disabled={status === 'out'}
                            >
                                Check Out
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>Location: Office HQ (Detected)</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                                    <div key={day} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 transition-colors">
                                        <span className="font-medium text-muted-foreground w-12">{day}</span>
                                        <div className="flex-1 flex items-center justify-center gap-2">
                                            <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                        <span className="text-green-600 font-medium text-xs ml-4">9h 0m</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminAttendance = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
                    <p className="text-muted-foreground">Monitor daily employee attendance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Date:</span>
                    <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Today
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Present</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">112</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Late Arrival</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-500">14</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">5</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-500">8</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Employee</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Check In</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Check Out</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Work Hours</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-4 font-medium">Employee {i}</td>
                                        <td className="p-4">09:0{i} AM</td>
                                        <td className="p-4">06:00 PM</td>
                                        <td className="p-4">8h 5{i}m</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                                                Present
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const AttendancePage = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return user.role === 'admin' ? <AdminAttendance /> : <EmployeeAttendance />;
};

export default AttendancePage;
