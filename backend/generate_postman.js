
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const createItem = (name, method, urlPath, body = null) => {
    const item = {
        name: name,
        request: {
            method: method,
            header: [],
            url: {
                raw: "{{baseUrl}}" + urlPath,
                host: ["{{baseUrl}}"],
                path: urlPath.replace(/^\//, '').split('/')
            }
        },
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

const createFolder = (name, items) => {
    return {
        name: name,
        item: items,
        description: `Endpoints for ${name}`
    };
};

const collection = {
    info: {
        _postman_id: crypto.randomUUID(),
        name: "Dayflow HRMS API",
        description: "Complete API collection for Dayflow HRMS",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
        {
            key: "baseUrl",
            value: "http://localhost:5000/api",
            type: "string"
        },
        {
            key: "token",
            value: "",
            type: "string"
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

// Auth Routes
const authItems = [];
const signinItem = createItem("Sign In", "POST", "/auth/signin", {
    email: "admin@dayflow.com",
    password: "password123"
});
// Add test script to capture token
signinItem.event = [{
    listen: "test",
    script: {
        exec: [
            "var jsonData = pm.response.json();",
            "if (jsonData.token) {",
            "    pm.collectionVariables.set(\"token\", jsonData.token);",
            "    console.log(\"Token updated successfully\");",
            "}"
        ],
        type: "text/javascript"
    }
}];
authItems.push(signinItem);

authItems.push(createItem("Sign Up", "POST", "/auth/signup", {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "employee"
}));

authItems.push(createItem("Get Me", "GET", "/auth/me"));
authItems.push(createItem("Forgot Password", "POST", "/auth/forgot-password", { email: "john@example.com" }));
authItems.push(createItem("Verify Email", "GET", "/auth/verify-email/:token"));
authItems.push(createItem("Reset Password", "POST", "/auth/reset-password/:token", { password: "newpassword123" }));

collection.item.push(createFolder("Auth", authItems));

// Employee Routes
const empItems = [];
empItems.push(createItem("My Profile", "GET", "/employees/profile"));
empItems.push(createItem("Update My Profile", "PUT", "/employees/profile", {
    phoneNumber: "1234567890",
    address: "123 Main St"
}));
empItems.push(createItem("Upload Profile Picture", "POST", "/employees/upload-picture"));
empItems.push(createItem("Upload Document", "POST", "/employees/upload-document"));
empItems.push(createItem("Get All Employees (Admin/HR)", "GET", "/employees"));
empItems.push(createItem("Get Departments", "GET", "/employees/departments"));
empItems.push(createItem("Get Employee By ID (Admin/HR)", "GET", "/employees/:id"));
empItems.push(createItem("Update Employee (Admin/HR)", "PUT", "/employees/:id", {
    role: "manager",
    department: "IT"
}));
empItems.push(createItem("Delete Employee (Admin/HR)", "DELETE", "/employees/:id"));

collection.item.push(createFolder("Employees", empItems));

// Attendance Routes
const attItems = [];
attItems.push(createItem("Check In", "POST", "/attendance/check-in", {
    location: "Office",
    coordinates: { lat: 0, lng: 0 }
}));
attItems.push(createItem("Check Out", "POST", "/attendance/check-out"));
attItems.push(createItem("My Attendance", "GET", "/attendance/my-attendance"));
attItems.push(createItem("All Attendance (Admin/HR)", "GET", "/attendance/all"));
attItems.push(createItem("Attendance Stats (Admin/HR)", "GET", "/attendance/stats"));
attItems.push(createItem("Mark Attendance (Admin/HR)", "POST", "/attendance/mark", {
    employeeId: "emp_id_here",
    date: "2024-01-01",
    status: "present"
}));
attItems.push(createItem("Update Attendance (Admin/HR)", "PUT", "/attendance/:id", {
    status: "absent"
}));

collection.item.push(createFolder("Attendance", attItems));

// Leave Routes
const leaveItems = [];
leaveItems.push(createItem("Apply Leave", "POST", "/leaves/apply", {
    type: "Sick Leave",
    startDate: "2024-01-10",
    endDate: "2024-01-11",
    reason: "Fever"
}));
leaveItems.push(createItem("My Leaves", "GET", "/leaves/my-leaves"));
leaveItems.push(createItem("Leave Balance", "GET", "/leaves/balance"));
leaveItems.push(createItem("Cancel Leave", "PUT", "/leaves/:id/cancel"));
leaveItems.push(createItem("All Leaves (Admin/HR)", "GET", "/leaves/all"));
leaveItems.push(createItem("Leave Stats (Admin/HR)", "GET", "/leaves/stats"));
leaveItems.push(createItem("Approve Leave (Admin/HR)", "PUT", "/leaves/:id/approve"));
leaveItems.push(createItem("Reject Leave (Admin/HR)", "PUT", "/leaves/:id/reject", {
    reason: "Not enough balance"
}));

collection.item.push(createFolder("Leaves", leaveItems));

// Payroll Routes
const payrollItems = [];
payrollItems.push(createItem("My Payroll", "GET", "/payroll/my-payroll"));
payrollItems.push(createItem("All Payrolls (Admin/HR)", "GET", "/payroll/all"));
payrollItems.push(createItem("Payroll Stats (Admin/HR)", "GET", "/payroll/stats"));
payrollItems.push(createItem("Get Payroll By ID (Admin/HR)", "GET", "/payroll/:id"));
payrollItems.push(createItem("Create/Update Payroll (Admin/HR)", "POST", "/payroll", {
    employeeId: "emp_id_here",
    month: 1,
    year: 2024,
    basicSalary: 5000
}));
payrollItems.push(createItem("Generate Monthly Payroll (Admin)", "POST", "/payroll/generate", {
    month: 1,
    year: 2024
}));
payrollItems.push(createItem("Update Payment Status (Admin/HR)", "PUT", "/payroll/:id/payment-status", {
    status: "Paid"
}));

collection.item.push(createFolder("Payroll", payrollItems));

// Dashboard Routes
const dashItems = [];
dashItems.push(createItem("Employee Dashboard", "GET", "/dashboard/employee"));
dashItems.push(createItem("Admin Dashboard", "GET", "/dashboard/admin"));
dashItems.push(createItem("Recent Activity", "GET", "/dashboard/activity"));

collection.item.push(createFolder("Dashboard", dashItems));

// Write to file
const outputPath = path.resolve(__dirname, 'Dayflow-HRMS-API.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 4));

console.log("Postman collection generated successfully:", outputPath);
