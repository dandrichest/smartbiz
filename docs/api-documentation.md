# API Documentation

# SmartBiz

## Overview

This document defines the REST API endpoints for SmartBiz.

Base URL:

```text
http://localhost:5000/api
```

---

# Authentication API

## Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "admin@smartbiz.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "123",
    "name": "Daniel",
    "role": "admin"
  }
}
```

---

## Get Current User

### Endpoint

```http
GET /api/auth/me
```

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "id": "123",
  "name": "Daniel",
  "email": "admin@smartbiz.com",
  "role": "admin"
}
```

---

# Products API

## Get All Products

### Endpoint

```http
GET /api/products
```

### Response

```json
[
  {
    "_id": "p001",
    "name": "Cotton Fabric",
    "category": "Fabric",
    "price": 5000,
    "quantity": 100
  }
]
```

---

## Get Single Product

### Endpoint

```http
GET /api/products/:id
```

### Response

```json
{
  "_id": "p001",
  "name": "Cotton Fabric",
  "category": "Fabric",
  "price": 5000,
  "quantity": 100
}
```

---

## Add Product

### Endpoint

```http
POST /api/products
```

### Request Body

```json
{
  "name": "Cotton Fabric",
  "category": "Fabric",
  "price": 5000,
  "quantity": 100,
  "description": "High-quality cotton fabric"
}
```

### Response

```json
{
  "message": "Product created successfully"
}
```

---

## Update Product

### Endpoint

```http
PUT /api/products/:id
```

### Request Body

```json
{
  "name": "Cotton Fabric",
  "price": 5500,
  "quantity": 120
}
```

### Response

```json
{
  "message": "Product updated successfully"
}
```

---

## Delete Product

### Endpoint

```http
DELETE /api/products/:id
```

### Response

```json
{
  "message": "Product deleted successfully"
}
```

---

## Search Products

### Endpoint

```http
GET /api/products/search?q=fabric
```

### Response

```json
[
  {
    "_id": "p001",
    "name": "Cotton Fabric"
  }
]
```

---

# Customer API

## Get All Customers

### Endpoint

```http
GET /api/customers
```

### Response

```json
[
  {
    "_id": "c001",
    "firstName": "John",
    "lastName": "Doe"
  }
]
```

---

## Get Customer By ID

### Endpoint

```http
GET /api/customers/:id
```

### Response

```json
{
  "_id": "c001",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678"
}
```

---

## Add Customer

### Endpoint

```http
POST /api/customers
```

### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "email": "john@example.com"
}
```

### Response

```json
{
  "message": "Customer added successfully"
}
```

---

## Update Customer

### Endpoint

```http
PUT /api/customers/:id
```

### Response

```json
{
  "message": "Customer updated successfully"
}
```

---

## Delete Customer

### Endpoint

```http
DELETE /api/customers/:id
```

### Response

```json
{
  "message": "Customer deleted successfully"
}
```

---

# Sales API

## Record Sale

### Endpoint

```http
POST /api/sales
```

### Request Body

```json
{
  "customerId": "c001",
  "productId": "p001",
  "quantitySold": 3
}
```

### Response

```json
{
  "message": "Sale recorded successfully"
}
```

---

## Get All Sales

### Endpoint

```http
GET /api/sales
```

### Response

```json
[
  {
    "_id": "s001",
    "customerId": "c001",
    "productId": "p001",
    "quantitySold": 3,
    "amount": 15000
  }
]
```

---

## Sales History

### Endpoint

```http
GET /api/sales/history
```

### Response

```json
[
  {
    "saleId": "s001",
    "productName": "Cotton Fabric",
    "quantitySold": 3,
    "amount": 15000,
    "saleDate": "2026-07-07"
  }
]
```

---

# Reports API

## Sales Report

### Endpoint

```http
GET /api/reports/sales
```

### Response

```json
{
  "totalSales": 250000,
  "transactions": 45
}
```

---

## Analytics Dashboard

### Endpoint

```http
GET /api/reports/analytics
```

### Response

```json
{
  "totalProducts": 120,
  "totalCustomers": 75,
  "totalSales": 250000,
  "topSellingProducts": [
    {
      "name": "Cotton Fabric",
      "quantitySold": 50
    }
  ]
}
```

---

# Low Stock Alerts API

## Get Low Stock Products

### Endpoint

```http
GET /api/reports/low-stock
```

### Response

```json
[
  {
    "_id": "p001",
    "name": "Cotton Fabric",
    "quantity": 5
  }
]
```

---

# Status Codes

## Success

```text
200 OK
201 Created
```

## Client Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

## Server Errors

```text
500 Internal Server Error
```

---

# Authentication

Protected routes require a JWT token.

Example:

```http
Authorization: Bearer <jwt_token>
```

---

# Future API Enhancements

- Receipt Generation API
- Supplier Management API
- Purchase Order API
- Barcode Scanning API
- Multi-Store Inventory API