import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-grid-slate-50/[0.05] dark:bg-grid-slate-900/[0.05]">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-secondary/30 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-8">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            v1.0 Release Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground font-heading">
            Simplify Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Workday</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The complete HR Management System designed for modern enterprises. Handle payroll, attendance, and leave with elegance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            variant="gradient"
            className="text-lg px-8 h-14"
            onClick={() => navigate('/auth/login')}
          >
            Get Started Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 h-14 border-primary/20 hover:bg-primary/5"
            onClick={() => navigate('/features')}
          >
            Learn More
          </Button>
        </div>

        <div id="features" className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card className="border-primary/10 shadow-xl shadow-primary/5 hover:border-primary/30 transition-all duration-300 group">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-6 h-6"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
              </div>
              <CardTitle className="text-xl">HR Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Streamline core operations from onboarding to payroll processing with our unified dashboard.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 shadow-xl shadow-secondary/5 hover:border-secondary/40 transition-all duration-300 group">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-foreground w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <CardTitle className="text-xl">Employee Self-Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Empower your workforce to manage their profile, apply for leaves, and view payslips independently.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
