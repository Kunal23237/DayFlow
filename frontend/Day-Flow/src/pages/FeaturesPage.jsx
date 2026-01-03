import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Users, Clock, CalendarCheck, Banknote, FileText, BarChart3, ArrowRight } from 'lucide-react';

const FeaturesPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "HR Management Suite",
            description: "Complete control over employee data, onboarding, and organizational structure.",
            icon: Users,
            link: "/hr-management"
        },
        {
            title: "Employee Self-Service",
            description: "Empower employees to update profiles, view documents, and manage their own data.",
            icon: FileText,
            link: "/employee-portal"
        },
        {
            title: "Attendance & Time Tracking",
            description: "Real-time clock-in/out, biometric integration support, and detailed timesheets.",
            icon: Clock,
            link: "/admin-dashboard/attendance"
        },
        {
            title: "Leave & Approval Workflow",
            description: "Automated leave requests, multi-level approvals, and holiday calendar management.",
            icon: CalendarCheck,
            link: "/admin-dashboard/leave"
        },
        {
            title: "Payroll & Salary Insights",
            description: "Automated salary calculation, payslip generation, and tax deduction management.",
            icon: Banknote,
            link: "/admin-dashboard/payroll"
        },
        {
            title: "Reports & Analytics",
            description: "Data-driven insights into workforce trends, attrition, and performance.",
            icon: BarChart3,
            link: "/admin-dashboard"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <header className="py-12 px-4 sm:px-6 lg:px-8 text-center bg-muted/30 border-b">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl mb-4">
                    Powerful Features for Modern HR
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
                    Everything you need to manage your workforce effectively, all in one place.
                </p>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="flex flex-col hover:shadow-lg transition-all duration-200 border-primary/10 hover:border-primary/30">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-between group"
                                    onClick={() => navigate(feature.link)}
                                >
                                    Explore
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 text-center space-y-8 bg-primary/5 rounded-3xl p-12">
                    <h2 className="text-3xl font-bold tracking-tight">Ready to streamline your HR?</h2>
                    <Button size="lg" className="px-8 text-lg" onClick={() => navigate('/auth/register')}>
                        Get Started Today
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default FeaturesPage;
