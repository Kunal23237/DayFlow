
import json
import uuid

def create_item(name, request_method, url_path, body=None, auth=None):
    item = {
        "name": name,
        "request": {
            "method": request_method,
            "header": [],
            "url": {
                "raw": "{{baseUrl}}" + url_path,
                "host": ["{{baseUrl}}"],
                "path": url_path.strip("/").split("/")
            }
        },
        "response": []
    }
    
    if body:
        item["request"]["body"] = {
            "mode": "raw",
            "raw": json.dumps(body, indent=4),
            "options": {
                "raw": {
                    "language": "json"
                }
            }
        }
    
    # Inherit auth from collection by default, but can override if needed
    # For this collection, we'll set auth at the collection level, so usually no need to add here
    # unless it's public, in which case we might want to explicitly set 'noauth' (Postman inherits by default)
    # But for simplicity, we rely on parent auth.
    
    return item

def create_folder(name, items):
    return {
        "name": name,
        "item": items,
        "description": f"Enpoints for {name}"
    }

collection = {
    "info": {
        "_postman_id": str(uuid.uuid4()),
        "name": "Dayflow HRMS API",
        "description": "Complete API collection for Dayflow HRMS",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:5000/api",
            "type": "string"
        },
        {
            "key": "token",
            "value": "",
            "type": "string"
        }
    ],
    "auth": {
        "type": "bearer",
        "bearer": [
            {
                "key": "token",
                "value": "{{token}}",
                "type": "string"
            }
        ]
    },
    "item": []
}

# Auth Routes
auth_items = []

signin_item = create_item("Sign In", "POST", "/auth/signin", {
    "email": "admin@dayflow.com",
    "password": "password123"
})
# Add test script to capture token
signin_item["event"] = [{
    "listen": "test",
    "script": {
        "exec": [
            "var jsonData = pm.response.json();",
            "if (jsonData.token) {",
            "    pm.collectionVariables.set(\"token\", jsonData.token);",
            "    console.log(\"Token updated successfully\");",
            "}"
        ],
        "type": "text/javascript"
    }
}]
auth_items.append(signin_item)

auth_items.append(create_item("Sign Up", "POST", "/auth/signup", {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "employee"
}))

auth_items.append(create_item("Get Me", "GET", "/auth/me"))
auth_items.append(create_item("Forgot Password", "POST", "/auth/forgot-password", {"email": "john@example.com"}))

# Public route explicitly? No, Postman works fine.
auth_items.append(create_item("Verify Email", "GET", "/auth/verify-email/:token"))
auth_items.append(create_item("Reset Password", "POST", "/auth/reset-password/:token", {"password": "newpassword123"}))

collection["item"].append(create_folder("Auth", auth_items))

# Employee Routes
emp_items = []
emp_items.append(create_item("My Profile", "GET", "/employees/profile"))
emp_items.append(create_item("Update My Profile", "PUT", "/employees/profile", {
    "phoneNumber": "1234567890",
    "address": "123 Main St"
}))
emp_items.append(create_item("Upload Profile Picture", "POST", "/employees/upload-picture")) # Usually form-data but raw for template
# Form-data hint for body
# (skipping complex form-data construction for script simplicity, raw json is default/placeholder)

emp_items.append(create_item("Get All Employees (Admin/HR)", "GET", "/employees"))
emp_items.append(create_item("Get Departments", "GET", "/employees/departments"))
emp_items.append(create_item("Get Employee By ID (Admin/HR)", "GET", "/employees/:id"))
emp_items.append(create_item("Update Employee (Admin/HR)", "PUT", "/employees/:id", {
    "role": "manager",
    "department": "IT"
}))
emp_items.append(create_item("Delete Employee (Admin/HR)", "DELETE", "/employees/:id"))

collection["item"].append(create_folder("Employees", emp_items))

# Attendance Routes
att_items = []
att_items.append(create_item("Check In", "POST", "/attendance/check-in", {
    "location": "Office",
    "coordinates": {"lat": 0, "lng": 0}
}))
att_items.append(create_item("Check Out", "POST", "/attendance/check-out"))
att_items.append(create_item("My Attendance", "GET", "/attendance/my-attendance"))
att_items.append(create_item("All Attendance (Admin/HR)", "GET", "/attendance/all"))
att_items.append(create_item("Attendance Stats (Admin/HR)", "GET", "/attendance/stats"))
att_items.append(create_item("Mark Attendance (Admin/HR)", "POST", "/attendance/mark", {
    "employeeId": "emp_id_here",
    "date": "2024-01-01",
    "status": "present"
}))
att_items.append(create_item("Update Attendance (Admin/HR)", "PUT", "/attendance/:id", {
    "status": "absent"
}))

collection["item"].append(create_folder("Attendance", att_items))

# Leave Routes
leave_items = []
leave_items.append(create_item("Apply Leave", "POST", "/leaves/apply", {
    "type": "Sick Leave",
    "startDate": "2024-01-10",
    "endDate": "2024-01-11",
    "reason": "Fever"
}))
leave_items.append(create_item("My Leaves", "GET", "/leaves/my-leaves"))
leave_items.append(create_item("Leave Balance", "GET", "/leaves/balance"))
leave_items.append(create_item("Cancel Leave", "PUT", "/leaves/:id/cancel"))
leave_items.append(create_item("All Leaves (Admin/HR)", "GET", "/leaves/all"))
leave_items.append(create_item("Leave Stats (Admin/HR)", "GET", "/leaves/stats"))
leave_items.append(create_item("Approve Leave (Admin/HR)", "PUT", "/leaves/:id/approve"))
leave_items.append(create_item("Reject Leave (Admin/HR)", "PUT", "/leaves/:id/reject", {
    "reason": "Not enough balance"
}))

collection["item"].append(create_folder("Leaves", leave_items))

# Payroll Routes
payroll_items = []
payroll_items.append(create_item("My Payroll", "GET", "/payroll/my-payroll"))
payroll_items.append(create_item("All Payrolls (Admin/HR)", "GET", "/payroll/all"))
payroll_items.append(create_item("Payroll Stats (Admin/HR)", "GET", "/payroll/stats"))
payroll_items.append(create_item("Get Payroll By ID (Admin/HR)", "GET", "/payroll/:id"))
payroll_items.append(create_item("Create/Update Payroll (Admin/HR)", "POST", "/payroll", {
    "employeeId": "emp_id_here",
    "month": 1,
    "year": 2024,
    "basicSalary": 5000
}))
payroll_items.append(create_item("Generate Monthly Payroll (Admin)", "POST", "/payroll/generate", {
    "month": 1,
    "year": 2024
}))
payroll_items.append(create_item("Update Payment Status (Admin/HR)", "PUT", "/payroll/:id/payment-status", {
    "status": "Paid"
}))

collection["item"].append(create_folder("Payroll", payroll_items))

# Dashboard Routes
dash_items = []
dash_items.append(create_item("Employee Dashboard", "GET", "/dashboard/employee"))
dash_items.append(create_item("Admin Dashboard", "GET", "/dashboard/admin"))
dash_items.append(create_item("Recent Activity", "GET", "/dashboard/activity"))

collection["item"].append(create_folder("Dashboard", dash_items))

# Write to file
with open(r'c:\Users\admin\Desktop\Dayflow\backend\Dayflow-HRMS-API.postman_collection.json', 'w') as f:
    json.dump(collection, f, indent=4)

print("Postman collection generated successfully.")
