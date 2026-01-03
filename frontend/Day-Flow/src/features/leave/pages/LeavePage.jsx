import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { CheckCircle2, XCircle, Clock, CalendarIcon, Plus } from 'lucide-react';

const EmployeeLeaveView = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leave Request</h2>
                    <p className="text-muted-foreground">Manage your leaves and time off.</p>
                </div>
                <Button><Plus className="mr-2 h-4 w-4" /> New Request</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {['Casual Leave', 'Sick Leave', 'Earned Leave', 'Unpaid Leave'].map((type) => (
                    <Card key={type}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12 / 12</div>
                            <p className="text-xs text-muted-foreground">Available</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Request History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-green-500/10 text-green-600'}`}>
                                        {i === 1 ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">Sick Leave Application</p>
                                        <p className="text-xs text-muted-foreground">Oct 24 - Oct 26 • 3 Days</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${i === 1 ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
                                    {i === 1 ? 'Pending Review' : 'Approved'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const AdminLeaveView = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leave Approvals</h2>
                    <p className="text-muted-foreground">Manage employee leave requests.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">ED</div>
                            <div className="flex-1">
                                <CardTitle className="text-base">Employee Name {i}</CardTitle>
                                <CardDescription className="text-xs">Software Engineer</CardDescription>
                            </div>
                            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Pending</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-medium">Sick Leave</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-medium">Oct 24 - Oct 26 (3 Days)</span>
                            </div>
                            <div className="p-3 rounded-md bg-muted/50 text-sm italic text-muted-foreground">
                                "Not feeling well, need rest for recovery."
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2 pt-0">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" size="sm">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                            </Button>
                            <Button variant="outline" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" size="sm">
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader><CardTitle>Past Approvals</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-sm text-center text-muted-foreground py-8">No historical data available.</div>
                </CardContent>
            </Card>
        </div>
    );
};

// Simple Badge component to replace the missing import if needed, 
// or simply use the styled span as before if the component doesn't exist.
// Since I imported Badge from ui/button (which likely doesn't exist there), 
// I'll quickly define a local one or revert to spans in the code above.
// Correcting the import assumption:
const Badge = ({ children, className }) => (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${className}`}>
        {children}
    </span>
);


const LeavePage = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return user.role === 'admin' ? <AdminLeaveView /> : <EmployeeLeaveView />;
};

export default LeavePage;
