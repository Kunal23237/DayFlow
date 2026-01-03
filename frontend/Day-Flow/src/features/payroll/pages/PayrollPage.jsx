import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const PayrollPage = () => {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
            <Button variant="outline">Download Payslips</Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Salary Structure</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Basic Salary</p>
                            <p className="text-lg font-bold">₹ 50,000</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">HRA</p>
                            <p className="text-lg font-bold">₹ 25,000</p>
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Net Payable</p>
                        <p className="text-2xl font-bold text-primary">₹ 68,500</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default PayrollPage;
