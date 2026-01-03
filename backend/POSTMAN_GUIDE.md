# Dayflow HRMS API - Postman Testing Guide

## 🚀 Quick Start

### 1. Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select the file: `Dayflow-HRMS-API.postman_collection.json`
4. The collection will be imported with all endpoints

### 2. Server Status

**Server is running at:** `http://localhost:5000`

**Check health:**
```
GET http://localhost:5000/health
```

---

## 📝 Testing Workflow

### Step 1: Create Admin Account

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "email": "admin@dayflow.com",
  "password": "Admin@123",
  "role": "Admin",
  "firstName": "Admin",
  "lastName": "User"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "...",
      "employeeId": "EMP001",
      "email": "admin@dayflow.com",
      "role": "Admin",
      "isEmailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Step 2: Sign In

**Endpoint:** `POST /api/auth/signin`

**Request Body:**
```json
{
  "email": "admin@dayflow.com",
  "password": "Admin@123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "employeeId": "EMP001",
      "email": "admin@dayflow.com",
      "role": "Admin",
      "isEmailVerified": false,
      "employee": {
        "id": "...",
        "fullName": "Admin User",
        "department": "Not Assigned",
        "designation": "Not Assigned",
        "profilePicture": null
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Important:** Copy the `token` value - you'll need it for all protected endpoints!

---

### Step 3: Set Authorization Token

In Postman:
1. Go to the **Collection** (Dayflow HRMS API)
2. Click on **Variables** tab
3. Set the `token` variable to the token you received from sign in
4. **OR** the collection auto-saves the token after successful sign in

All protected endpoints will now use this token automatically!

---

### Step 4: Test Employee Endpoints

#### Get My Profile
```
GET /api/employees/profile
Authorization: Bearer {{token}}
```

#### Update My Profile
```
PUT /api/employees/profile
Authorization: Bearer {{token}}

Body:
{
  "phone": "9876543210",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zipCode": "400001"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "9876543211"
  }
}
```

---

### Step 5: Test Attendance

#### Check In
```
POST /api/attendance/check-in
Authorization: Bearer {{token}}

Body:
{
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "address": "Mumbai, India"
  }
}
```

#### Check Out
```
POST /api/attendance/check-out
Authorization: Bearer {{token}}

Body:
{
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "address": "Mumbai, India"
  }
}
```

#### Get My Attendance
```
GET /api/attendance/my-attendance?view=monthly
Authorization: Bearer {{token}}
```

---

### Step 6: Test Leave Management

#### Apply for Leave
```
POST /api/leaves/apply
Authorization: Bearer {{token}}

Body:
{
  "leaveType": "Paid",
  "startDate": "2026-01-10",
  "endDate": "2026-01-12",
  "reason": "Family function to attend",
  "isHalfDay": false
}
```

#### Get My Leaves
```
GET /api/leaves/my-leaves
Authorization: Bearer {{token}}
```

#### Get Leave Balance
```
GET /api/leaves/balance
Authorization: Bearer {{token}}
```

---

### Step 7: Test Dashboard

#### Employee Dashboard
```
GET /api/dashboard/employee
Authorization: Bearer {{token}}
```

#### Admin Dashboard
```
GET /api/dashboard/admin
Authorization: Bearer {{token}}
```

---

## 🔐 Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

The Postman collection automatically adds this header using the `{{token}}` variable.

---

## 📊 Available Endpoints

### Authentication (6 endpoints)
- ✅ Sign Up
- ✅ Sign In
- ✅ Get Current User
- ✅ Verify Email
- ✅ Forgot Password
- ✅ Reset Password

### Employees (7 endpoints)
- ✅ Get My Profile
- ✅ Update My Profile
- ✅ Get All Employees (Admin)
- ✅ Get Employee by ID (Admin)
- ✅ Upload Profile Picture
- ✅ Upload Document
- ✅ Get Departments

### Attendance (6 endpoints)
- ✅ Check In
- ✅ Check Out
- ✅ Get My Attendance
- ✅ Get All Attendance (Admin)
- ✅ Mark Attendance (Admin)
- ✅ Get Attendance Stats (Admin)

### Leaves (8 endpoints)
- ✅ Apply for Leave
- ✅ Get My Leaves
- ✅ Get Leave Balance
- ✅ Get All Leaves (Admin)
- ✅ Approve Leave (Admin)
- ✅ Reject Leave (Admin)
- ✅ Cancel Leave
- ✅ Get Leave Stats (Admin)

### Payroll (6 endpoints)
- ✅ Get My Payroll
- ✅ Get All Payrolls (Admin)
- ✅ Create/Update Payroll (Admin)
- ✅ Generate Monthly Payroll (Admin)
- ✅ Update Payment Status (Admin)
- ✅ Get Payroll Stats (Admin)

### Dashboard (3 endpoints)
- ✅ Get Employee Dashboard
- ✅ Get Admin Dashboard
- ✅ Get Recent Activity

**Total: 36+ API Endpoints**

---

## 🎯 Testing Scenarios

### Scenario 1: Complete Employee Workflow
1. Sign up as employee
2. Sign in
3. Update profile
4. Check in
5. Check out
6. View attendance
7. Apply for leave
8. Check leave balance
9. View dashboard

### Scenario 2: Admin Workflow
1. Sign in as admin
2. View all employees
3. View pending leaves
4. Approve/reject leaves
5. Mark attendance for employees
6. Generate monthly payroll
7. View admin dashboard
8. View statistics

### Scenario 3: Leave Management
1. Employee applies for leave
2. Admin views pending leaves
3. Admin approves leave
4. Employee checks leave balance
5. Leave is deducted from balance

---

## 📝 Sample Data

### Leave Types
- `Paid`
- `Sick`
- `Casual`
- `Unpaid`
- `Maternity`
- `Paternity`

### Attendance Status
- `Present`
- `Absent`
- `Half-day`
- `Leave`
- `Holiday`
- `Weekend`

### Payment Status
- `Pending`
- `Processed`
- `Paid`
- `On Hold`

### User Roles
- `Employee`
- `HR`
- `Admin`

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error
**Solution:** Make sure you have set the `token` variable in the collection

### Issue: "Validation Error"
**Solution:** Check the request body format matches the examples

### Issue: "Employee profile not found"
**Solution:** Sign up creates a basic profile. Update it using the update profile endpoint

### Issue: "Insufficient leave balance"
**Solution:** Check your leave balance before applying

---

## 📚 Additional Resources

- **API Documentation:** See [README.md](file:///c:/Users/admin/Desktop/Dayflow/backend/README.md)
- **Implementation Details:** See [walkthrough.md](file:///C:/Users/admin/.gemini/antigravity/brain/d34ec607-d369-402e-aaf0-ad34e1312e5d/walkthrough.md)

---

**Happy Testing! 🚀**
