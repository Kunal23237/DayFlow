import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-50 dark:bg-slate-950">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="space-y-4">
             <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                v1.0 Release
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
            DayFlow
            </h1>
            <p className="text-2xl font-light text-muted-foreground">Every workday, perfectly aligned.</p>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            The complete HR Management System designed for modern enterprises. Handle payroll, attendance, and leave with elegance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
                onClick={() => navigate('/auth/login')}
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </button>
            <button 
                onClick={() => navigate('/features')}
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Learn More
            </button>
        </div>

        <div id="features" className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">HR Management</h3>
                <p className="text-sm text-muted-foreground">Streamline core operations from onboarding to payroll processing with our unified dashboard.</p>
            </div>
             <div className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Employee Self-Service</h3>
                <p className="text-sm text-muted-foreground">Empower your workforce to manage their profile, apply for leaves, and view payslips independently.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
