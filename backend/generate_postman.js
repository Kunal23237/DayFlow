
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const createItem = (name, method, urlPath, body = null, description = "") => {
    const item = {
        name: name,
        request: {
            method: method,
            header: [],
            url: {
                raw: "{{baseUrl}}" + urlPath,
                host: ["{{baseUrl}}"],
                path: urlPath.replace(/^\//, '').split('/')
            },
            description: description
        },
        event: [
            {
                listen: "test",
                script: {
                    exec: [
                        "pm.test(\"Status code is 200/201\", function () {",
                        "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
                        "});",
                        "",
                        "pm.test(\"Response has success true\", function () {",
                        "    var jsonData = pm.response.json();",
                        "    if (jsonData.success !== undefined) {",
                        "        pm.expect(jsonData.success).to.be.true;",
                        "    }",
                        "});"
                    ],
                    type: "text/javascript"
                }
            }
        ],
        response: []
    };

    if (body) {
        item.request.body = {
            mode: "raw",
            raw: JSON.stringify(body, null, 4),
            options: {
                raw: {
                    language: "json"
                }
            }
        };
    }

    return item;
};

const createFolder = (name, items, description = "") => {
    return {
        name: name,
        item: items,
        description: description
    };
};

const collection = {
    info: {
        _postman_id: crypto.randomUUID(),
        name: "Dayflow HRMS API (Complete)",
        description: "A comprehensive API collection for Dayflow HRMS. Includes generic auth token handling and detailed examples for all roles.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
        {
            key: "baseUrl",
            value: "http://localhost:5000/api",
            type: "string",
            description: "Base URL for the API"
        },
        {
            key: "token",
            value: "",
            type: "string",
            description: "JWT Token for authentication (Auto-updated by Sign In)"
        }
    ],
    auth: {
        type: "bearer",
        bearer: [
            {
                key: "token",
                value: "{{token}}",
                type: "string"
            }
        ]
    },
    item: []
};

// ================= AUTHENTICATION =================
const authItems = [];

const signinDesc = `
**Step 1: Sign In**
Use this request to log in. 
- **Employee**: Use valid employee credentials.
- **Admin**: Use valid admin credentials.

**Note**: The script in the 'Tests' tab automatically saves the received 'token' to the collection variables.
`;
const signinItem = createItem("Sign In", "POST", "/auth/signin", {
    email: "admin@dayflow.com",
    password: "password123"
}, signinDesc);

// Specific script for capturing token
signinItem.event.push({
    listen: "test",
    script: {
        exec: [
            "var jsonData = pm.response.json();",
            "if (jsonData.token) {",
            "    pm.collectionVariables.set(\"token\", jsonData.token);",
            "    console.log(\"Token updated successfully\");",
            "    pm.test(\"Token captured\", function () {",
            "        pm.expect(pm.collectionVariables.get(\"token\")).to.not.be.empty;",
            "    });",
            "}"
        ],
        type: "text/javascript"
    }
});
authItems.push(signinItem);

authItems.push(createItem("Sign Up", "POST", "/auth/signup", {
    name: "New User",
    email: "newuser@dayflow.com",
    password: "password123",
    role: "Employee" // Enum: Employee, HR, Admin
}, "Register a new user account. Required fields: name, email, password."));

authItems.push(createItem("Get Current User (Me)", "GET", "/auth/me", null, "Get details of the currently logged-in user using the Bearer token."));

authItems.push(createItem("Forgot Password", "POST", "/auth/forgot-password", {
    email: "user@dayflow.com"
}, "Initiate password reset flow."));

authItems.push(createItem("Reset Password", "POST", "/auth/reset-password/:token", {
    password: "newpassword123"
}, "Reset password using the token received via email. Replace :token in URL."));

collection.item.push(createFolder("1. Auth", authItems, "Authentication endpoints. Start here."));


// ================= EMPLOYEES =================
const empItems = [];

// Profile
empItems.push(createItem("My Profile", "GET", "/employees/profile", null, "Get full profile details of the logged-in employee."));

empItems.push(createItem("Update My Profile", "PUT", "/employees/profile", {
    phoneNumber: "9876543210",
    address: {
        street: "456 Developer Lane",
        city: "Tech City",
        state: "CA",
        country: "USA",
        zipCode: "90001"
    },
    emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "1112223333"
    }
}, "Update personal details. Note: You cannot update core job details here."));

// Admin Operations
empItems.push(createItem("Get All Employees (Admin)", "GET", "/employees?page=1&limit=10", null, "HR/Admin: List all employees with pagination."));
empItems.push(createItem("Get Departments", "GET", "/employees/departments", null, "Get list of all distinct departments."));
empItems.push(createItem("Get Employee By ID", "GET", "/employees/:id", null, "HR/Admin: Get a specific employee's details."));

empItems.push(createItem("Update Employee (Admin)", "PUT", "/employees/:id", {
    designation: "Senior Developer",
    department: "Engineering",
    salary: 80000, // If applicable in this route
    role: "Employee"
}, "HR/Admin: Update job details, role, etc."));

empItems.push(createItem("Delete Employee (Admin)", "DELETE", "/employees/:id", null, "Admin: Soft delete or remove an employee."));

collection.item.push(createFolder("2. Employees", empItems, "Employee management endpoints."));


// ================= ATTENDANCE =================
const attItems = [];

attItems.push(createItem("Check In", "POST", "/attendance/check-in", {
    location: "Office Headquarters",
    coordinates: {
        lat: 37.7749,
        lng: -122.4194
    }
}, "Employee: Mark daily attendance check-in."));

attItems.push(createItem("Check Out", "POST", "/attendance/check-out", {
    location: "Office Headquarters",
    coordinates: {
        lat: 37.7749,
        lng: -122.4194
    }
}, "Employee: Mark daily attendance check-out."));

attItems.push(createItem("My Attendance History", "GET", "/attendance/my-attendance?month=1&year=2024", null, "Employee: View own attendance records."));

// Admin
attItems.push(createItem("All Attendance Records (Admin)", "GET", "/attendance/all?date=2024-01-03", null, "HR/Admin: View attendance for a specific date or range."));
attItems.push(createItem("Attendance Stats (Admin)", "GET", "/attendance/stats", null, "HR/Admin: Get aggregated attendance statistics."));

attItems.push(createItem("Mark Attendance Manually (Admin)", "POST", "/attendance/mark", {
    employeeId: "INSERT_EMPLOYEE_ID_HERE",
    date: "2024-01-03",
    status: "Present", // Enum: Present, Absent, Half-day, Leave
    checkIn: "2024-01-03T09:00:00.000Z",
    checkOut: "2024-01-03T17:00:00.000Z"
}, "HR/Admin: Manually correct or add attendance record."));

collection.item.push(createFolder("3. Attendance", attItems, "Daily attendance tracking."));


// ================= LEAVES =================
const leaveItems = [];

leaveItems.push(createItem("Apply for Leave", "POST", "/leaves/apply", {
    type: "Sick", // Enum: Paid, Sick, Casual, Unpaid, Maternity, Paternity
    startDate: "2024-02-01",
    endDate: "2024-02-02",
    reason: "Medical emergency",
    isHalfDay: false
}, "Employee: Submit a new leave request."));

leaveItems.push(createItem("My Leaves", "GET", "/leaves/my-leaves", null, "Employee: View leave history and status."));
leaveItems.push(createItem("Check Leave Balance", "GET", "/leaves/balance", null, "Employee: Check remaining leave quota."));
leaveItems.push(createItem("Cancel Leave", "PUT", "/leaves/:id/cancel", null, "Employee: Cancel a pending leave request."));

// Admin
leaveItems.push(createItem("All Leave Requests (Admin)", "GET", "/leaves/all?status=Pending", null, "HR/Admin: details of all leave requests. Filter by status (Pending, Approved, Rejected)."));

leaveItems.push(createItem("Approve Leave (Admin)", "PUT", "/leaves/:id/approve", null, "HR/Admin: Approve a leave request."));
leaveItems.push(createItem("Reject Leave (Admin)", "PUT", "/leaves/:id/reject", {
    reason: "Critical project deadline, please reschedule."
}, "HR/Admin: Reject a leave request with a reason."));

collection.item.push(createFolder("4. Leaves", leaveItems, "Leave management and approvals."));


// ================= PAYROLL =================
const payrollItems = [];

payrollItems.push(createItem("My Payroll History", "GET", "/payroll/my-payroll", null, "Employee: View salary slips/history."));

// Admin
payrollItems.push(createItem("All Payrolls (Admin)", "GET", "/payroll/all?month=1&year=2024", null, "HR/Admin: View payrolls for a specific period."));

payrollItems.push(createItem("Generate Monthly Payroll (Admin)", "POST", "/payroll/generate", {
    month: 1,
    year: 2024
}, "Admin: Trigger batch payroll generation for all active employees for the specified month."));

payrollItems.push(createItem("Create/Update Individual Payroll (Admin)", "POST", "/payroll", {
    employeeId: "INSERT_EMPLOYEE_ID_HERE",
    month: 1,
    year: 2024,
    basicSalary: 5000,
    hra: 2000,
    allowances: 1000,
    deductions: 500
}, "HR/Admin: Manually create or adjust a specific payroll record."));

payrollItems.push(createItem("Update Payment Status (Admin)", "PUT", "/payroll/:id/payment-status", {
    status: "Paid", // Enum: Pending, Processed, Paid, On Hold
    paymentMethod: "Bank Transfer",
    transactionId: "TXN123456789"
}, "HR/Admin: Mark a payroll record as Paid."));

collection.item.push(createFolder("5. Payroll", payrollItems, "Salary and payroll processing."));


// ================= DASHBOARD =================
const dashItems = [];
dashItems.push(createItem("Employee Dashboard Stats", "GET", "/dashboard/employee", null, "Get summary stats for the employee home screen."));
dashItems.push(createItem("Admin Dashboard Stats", "GET", "/dashboard/admin", null, "Get high-level company stats for the admin home screen."));
dashItems.push(createItem("Recent Activity", "GET", "/dashboard/activity", null, "Get recent system-wide activities."));

collection.item.push(createFolder("6. Dashboard", dashItems, "Aggregated statistics for dashboards."));


// Write to file
const outputPath = path.resolve(__dirname, 'Dayflow-HRMS-API.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 4));

console.log("Postman collection generated successfully:", outputPath);
