import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Users, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [role, setRole] = useState('employee');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine redirect path
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const userData = await login(email, password);

            // Redirect based on backend role, not UI selection
            // Normalize role to handle potential case differences
            const userRole = userData.role?.toLowerCase();

            if (from) {
                navigate(from, { replace: true });
            } else {
                if (['admin', 'hr'].includes(userRole)) {
                    navigate('/admin-dashboard', { replace: true });
                } else {
                    navigate('/employee-dashboard', { replace: true });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                    Select your role and enter your credentials.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-2">
                        <div
                            onClick={() => setRole('employee')}
                            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted ${role === 'employee' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-muted'}`}
                        >
                            <Users className={`h-6 w-6 ${role === 'employee' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${role === 'employee' ? 'text-primary' : 'text-muted-foreground'}`}>Employee</span>
                        </div>
                        <div
                            onClick={() => setRole('admin')}
                            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted ${role === 'admin' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-muted'}`}
                        >
                            <ShieldCheck className={`h-6 w-6 ${role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`}>Admin / HR</span>
                        </div>
                    </div>


                    {error && <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md">{error}</div>}

                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={role === 'admin' ? "admin@dayflow.com" : "employee@dayflow.com"}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : (role === 'admin' ? 'Login to Admin Dashboard' : 'Login to Employee Portal')}
                        </Button>
                    </form>
                </div>
            </CardContent>
            <CardFooter>
                <div className="mt-4 text-center text-sm w-full">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};

export default LoginPage;
