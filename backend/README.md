# Dayflow - Human Resource Management System (Backend)

**Every workday, perfectly aligned.**

A comprehensive HRMS backend API built with Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- ✅ Secure JWT-based authentication
- ✅ Role-based access control (Admin, HR, Employee)
- ✅ Email verification
- ✅ Password reset functionality

### Employee Management
- ✅ Complete employee profile management
- ✅ Document upload and storage (Cloudinary)
- ✅ Profile picture upload
- ✅ Department and designation management

### Attendance Tracking
- ✅ Daily check-in/check-out
- ✅ Automatic working hours calculation
- ✅ Late arrival tracking
- ✅ Manual attendance marking (Admin)
- ✅ Daily, weekly, and monthly attendance views
- ✅ Attendance statistics and reports

### Leave Management
- ✅ Leave application system
- ✅ Multiple leave types (Paid, Sick, Casual, Unpaid)
- ✅ Leave approval workflow
- ✅ Leave balance tracking
- ✅ Email notifications to HR/Admin

### Payroll Management
- ✅ Salary structure management
- ✅ Automatic payroll generation
- ✅ Attendance-based salary calculation
- ✅ Payment status tracking
- ✅ Payroll statistics and reports

### Dashboard & Analytics
- ✅ Employee dashboard with quick stats
- ✅ Admin dashboard with comprehensive analytics
- ✅ Recent activity tracking
- ✅ Department-wise statistics

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)
- SMTP server (for email notifications - optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update .env file with your credentials**
   - MongoDB connection string
   - JWT secrets
   - Cloudinary credentials (optional)
   - Email SMTP settings (optional)

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔧 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/dayflow-hrms

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_URL=http://localhost:5173
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees/profile` - Get own profile
- `PUT /api/employees/profile` - Update own profile
- `POST /api/employees/upload-picture` - Upload profile picture
- `POST /api/employees/upload-document` - Upload document
- `GET /api/employees` - Get all employees (Admin/HR)
- `GET /api/employees/:id` - Get employee by ID (Admin/HR)
- `PUT /api/employees/:id` - Update employee (Admin/HR)
- `DELETE /api/employees/:id` - Delete employee (Admin)

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/my-attendance` - Get own attendance
- `GET /api/attendance/all` - Get all attendance (Admin/HR)
- `POST /api/attendance/mark` - Mark attendance manually (Admin/HR)
- `PUT /api/attendance/:id` - Update attendance (Admin/HR)
- `GET /api/attendance/stats` - Get attendance statistics (Admin/HR)

### Leaves
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/my-leaves` - Get own leaves
- `GET /api/leaves/balance` - Get leave balance
- `PUT /api/leaves/:id/cancel` - Cancel leave
- `GET /api/leaves/all` - Get all leaves (Admin/HR)
- `PUT /api/leaves/:id/approve` - Approve leave (Admin/HR)
- `PUT /api/leaves/:id/reject` - Reject leave (Admin/HR)
- `GET /api/leaves/stats` - Get leave statistics (Admin/HR)

### Payroll
- `GET /api/payroll/my-payroll` - Get own payroll
- `GET /api/payroll/all` - Get all payrolls (Admin/HR)
- `GET /api/payroll/:id` - Get payroll by ID (Admin/HR)
- `POST /api/payroll` - Create/Update payroll (Admin/HR)
- `POST /api/payroll/generate` - Generate monthly payroll (Admin)
- `PUT /api/payroll/:id/payment-status` - Update payment status (Admin/HR)
- `GET /api/payroll/stats` - Get payroll statistics (Admin/HR)

### Dashboard
- `GET /api/dashboard/employee` - Get employee dashboard
- `GET /api/dashboard/admin` - Get admin dashboard (Admin/HR)
- `GET /api/dashboard/activity` - Get recent activity

## 🏗️ Project Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── cloudinary.js    # Cloudinary config
├── controllers/         # Route controllers
│   ├── auth.controller.js
│   ├── employee.controller.js
│   ├── attendance.controller.js
│   ├── leave.controller.js
│   ├── payroll.controller.js
│   └── dashboard.controller.js
├── middleware/          # Custom middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   ├── upload.middleware.js
│   └── error.middleware.js
├── models/             # Mongoose models
│   ├── User.model.js
│   ├── Employee.model.js
│   ├── Attendance.model.js
│   ├── Leave.model.js
│   └── Payroll.model.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── employee.routes.js
│   ├── attendance.routes.js
│   ├── leave.routes.js
│   ├── payroll.routes.js
│   └── dashboard.routes.js
├── utils/              # Utility functions
│   ├── logger.js
│   ├── emailService.js
│   └── responseHandler.js
├── logs/               # Log files
├── .env                # Environment variables
├── .env.example        # Environment template
├── server.js           # Entry point
└── package.json        # Dependencies
```

## 🔐 Security Features

- **Helmet.js** - Security headers
- **XSS Protection** - Prevent cross-site scripting
- **Rate Limiting** - Prevent brute force attacks
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Input Validation** - Express-validator
- **CORS** - Cross-origin resource sharing

## 📝 Logging

The application uses Winston for logging:
- **Console logs** - Development mode
- **File logs** - Production mode
  - `logs/combined.log` - All logs
  - `logs/error.log` - Error logs only
  - `logs/exceptions.log` - Uncaught exceptions
  - `logs/rejections.log` - Unhandled rejections

## 🧪 Testing

Test the API using:
- **Postman** - Import collection
- **Thunder Client** - VS Code extension
- **cURL** - Command line

Health check endpoint:
```bash
curl http://localhost:5000/health
```

## 🚀 Deployment

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Cloudinary Setup
1. Create a Cloudinary account
2. Get credentials from dashboard
3. Update Cloudinary variables in `.env`

### Email Setup (Optional)
For Gmail:
1. Enable 2-factor authentication
2. Generate app password
3. Update email variables in `.env`

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For support, email support@dayflow.com or create an issue in the repository.

---

**Built with ❤️ by the Dayflow Team**
