import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
// import { Label } from '../../../components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'; // Need to create Tabs component or simulated tabs
import { Camera, Mail, Phone, MapPin, Briefcase, Building, User, Calendar } from 'lucide-react';

const ProfileHeader = ({ user, isEditing, setIsEditing }) => {
    return (
        <Card className="bg-card text-card-foreground border-none shadow-md overflow-hidden relative mb-6">
            <div className="h-32 bg-gradient-to-r from-primary to-primary/80"></div>
            <CardContent className="pt-0 relative px-6 md:px-10 pb-8">
                <div className="flex flex-col md:flex-row gap-6 relative -top-12 mb-[-3rem]">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-full border-4 border-background bg-secondary text-secondary-foreground flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : (user?.name?.[0] || 'U')}
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 pt-12 md:pt-14 space-y-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{user?.name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <Briefcase className="h-3 w-3" /> {user?.role === 'admin' ? 'HR Manager' : 'Senior Developer'}
                                    <span className="mx-1">•</span>
                                    <Building className="h-3 w-3" /> {user?.department || 'Engineering'}
                                </p>
                            </div>
                            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'secondary' : 'default'} className="md:self-start">
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase font-semibold">Login ID</span>
                                <span className="font-medium text-sm">EMP-2024-001</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
                                <span className="font-medium text-sm truncate">{user?.email}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase font-semibold">Phone</span>
                                <span className="font-medium text-sm">+1 987 654 3210</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase font-semibold">Location</span>
                                <span className="font-medium text-sm">San Francisco, CA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AdminProfileView = ({ user, isEditing }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Left Column - About & Bio */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-2 text-primary">Professional Summary</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Experienced HR Manager with over 8 years in people operations, talent acquisition, and organizational development.
                                Proven track record of implementing efficient HR systems and fostering positive company culture.
                                Passionate about leveraging technology to streamline workforce management.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-2 text-primary">What I love about my job</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                I enjoy the challenge of balancing organizational goals with employee well-being.
                                Building teams that succeed together and creating an environment where people feel valued is my primary motivation.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-2 text-primary">Interests & Hobbies</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Avid reader of leadership psychology. Weekend hiker. Amateur photographer capturing urban landscapes.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Skills & Certifications */}
            <div className="space-y-6">
                <Card>
                    <CardHeader className="pb-3 border-b bg-muted/20">
                        <CardTitle className="text-base">Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['Strategic Planning', 'Talent Acquisition', 'Payroll Management', 'Labor Law', 'Conflict Resolution', 'HRIS'].map((skill) => (
                                <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-xs dashed border-primary/30 hover:border-primary text-primary">
                            + Add Skills
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3 border-b bg-muted/20">
                        <CardTitle className="text-base">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">SHRM</div>
                            <div>
                                <p className="text-sm font-semibold">SHRM-CP</p>
                                <p className="text-xs text-muted-foreground">Issued Dec 2022</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">PHR</div>
                            <div>
                                <p className="text-sm font-semibold">Professional in HR</p>
                                <p className="text-xs text-muted-foreground">Issued Jun 2020</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-xs dashed border-primary/30 hover:border-primary text-primary mt-2">
                            + Add Certification
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const EmployeePrivateView = ({ user, isEditing }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
            {/* Column 1: Personal Details */}
            <Card className="h-full">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Date of Birth</label>
                        <Input defaultValue="15 Aug 1995" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Residing Address</label>
                        <Input defaultValue="45/A, Green Valley Apts, Tech City" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Nationality</label>
                        <Input defaultValue="Indian" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Personal Email</label>
                        <Input defaultValue="john.doe.personal@gmail.com" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Gender</label>
                            <Input defaultValue="Male" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Marital Status</label>
                            <Input defaultValue="Single" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Date of Joining</label>
                        <Input defaultValue="01 Jan 2023" disabled className="bg-muted/50 border-0 opacity-70" />
                    </div>
                </CardContent>
            </Card>

            {/* Column 2: Bank & Identity */}
            <Card className="h-full">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base">Bank & Statutory Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Account Number</label>
                        <Input defaultValue="XXXX-XXXX-8976" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Bank Name</label>
                        <Input defaultValue="HDFC Bank" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">IFSC Code</label>
                        <Input defaultValue="HDFC0001234" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="border-t my-4"></div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">PAN Number</label>
                        <Input defaultValue="ABCDE1234F" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Aadhaar / UAN</label>
                        <Input defaultValue="100200300400" disabled={!isEditing} className="bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'resume' : 'private');

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            <ProfileHeader user={user} isEditing={isEditing} setIsEditing={setIsEditing} />

            {/* Custom Tabs Navigation */}
            <div className="border-b flex items-center space-x-6 px-2 mb-6 overflow-x-auto">
                {user.role === 'admin' && (
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'resume' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Resume / Bio
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('private')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'private' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Private Info
                </button>
                <button
                    onClick={() => setActiveTab('salary')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'salary' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Salary & Documents
                </button>
            </div>

            {activeTab === 'resume' && user.role === 'admin' && <AdminProfileView user={user} isEditing={isEditing} />}
            {activeTab === 'private' && <EmployeePrivateView user={user} isEditing={isEditing} />}
            {activeTab === 'salary' && (
                <div className="text-center py-20 bg-muted/10 rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground">Salary structure and document vault coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
