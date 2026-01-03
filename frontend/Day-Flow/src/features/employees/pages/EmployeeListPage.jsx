import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Search, MapPin, Phone, Mail, Briefcase, Calendar } from 'lucide-react';

const AdminEmployeeView = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
                    <p className="text-muted-foreground">Manage your organization's workforce.</p>
                </div>
                <Button>Add Employee</Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search employees by name or ID..." />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b bg-muted/50">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Department</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">Employee {i}</td>
                                            <td className="p-4 align-middle">Software Engineer</td>
                                            <td className="p-4 align-middle">Engineering</td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">Active</span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="sm">View</Button>
                                                <Button variant="ghost" size="sm" className="text-primary">Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const EmployeeListPage = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    // This page is now strictly for the Admin's Employee Directory.
    // Employees view their own profile via the /profile route (ProfilePage.jsx).
    // However, if an employee navigates here, we can redirect or show a "Not Authorized" message,
    // or simply redirect them to their profile if they somehow land here.
    // For now, if role is not admin, we'll return null or a basic message.

    if (user.role !== 'admin') {
        return <div className="p-10 text-center text-muted-foreground">Access Restricted. Only Admins can view the Employee Directory.</div>;
    }

    return <AdminEmployeeView />;
};

export default EmployeeListPage;
