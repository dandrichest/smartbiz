# System Architecture

# SmartBiz

## Architecture Overview

SmartBiz follows a three-tier architecture:

1. Presentation Layer (Frontend)
2. Application Layer (Backend)
3. Data Layer (Database)

---

## Architecture Diagram

Frontend (React.js)
        |
        |
        v
Backend API (Node.js + Express)
        |
        |
        v
Database (MongoDB Atlas)

---

## Frontend Responsibilities

- User Authentication UI
- Product Management UI
- Customer Management UI
- Sales Management UI
- Reports Dashboard
- Analytics Dashboard

---

## Backend Responsibilities

- Authentication
- Product CRUD Operations
- Customer CRUD Operations
- Sales Processing
- Report Generation
- Business Rules

---

## Database Responsibilities

- Store Users
- Store Products
- Store Customers
- Store Sales
- Store System Data

---

## Request Flow

1. User submits request in React application.
2. React sends API request to Express server.
3. Express processes request.
4. MongoDB stores or retrieves data.
5. Response is returned to the frontend.
6. User sees updated information.

---

## Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Environment Variables

Frontend (React)
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── AddProduct.jsx
│   │   ├── EditProduct.jsx
│   │   ├── Customers.jsx
│   │   ├── Sales.jsx
│   │   ├── Reports.jsx
│   │   └── Analytics.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── customerService.js
│   │   ├── salesService.js
│   │   └── reportService.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── README.md

Backend (Node.js + Express)
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── customerController.js
│   │   ├── salesController.js
│   │   └── reportController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Customer.js
│   │   └── Sale.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── salesRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── customerService.js
│   │   └── salesService.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   └── server.js
│
├── .env
├── package.json
└── README.md
