# Database Design

# Project: SmartBiz

## Overview

SmartBiz uses MongoDB to store and manage application data. The database is designed to support user authentication, inventory management, customer management, sales tracking, and reporting.

---

# Collections

## Users Collection

### Purpose
Stores system users and authentication information.

### Fields

| Field | Type | Description |
|---------|---------|---------|
| _id | ObjectId | Unique identifier |
| name | String | User's full name |
| email | String | User email address |
| password | String | Hashed password |
| role | String | admin or staff |
| createdAt | Date | Account creation date |
| updatedAt | Date | Last update date |

### Example

```json
{
  "_id": "u001",
  "name": "Daniel Olayinka",
  "email": "daniel@example.com",
  "password": "hashedPassword",
  "role": "admin"
}
```

---

## Products Collection

### Purpose

Stores inventory items.

### Fields

| Field | Type | Description |
|---------|---------|---------|
| _id | ObjectId | Unique identifier |
| name | String | Product name |
| category | String | Product category |
| price | Number | Product selling price |
| quantity | Number | Available stock quantity |
| description | String | Product description |
| createdAt | Date | Creation date |
| updatedAt | Date | Last update date |

### Example

```json
{
  "_id": "p001",
  "name": "Cotton Fabric",
  "category": "Fabric",
  "price": 5000,
  "quantity": 100,
  "description": "High-quality cotton fabric"
}
```

---

## Customers Collection

### Purpose

Stores customer information.

### Fields

| Field | Type | Description |
|---------|---------|---------|
| _id | ObjectId | Unique identifier |
| firstName | String | Customer first name |
| lastName | String | Customer last name |
| email | String | Customer email |
| phone | String | Customer phone |
| address | String | Customer address |
| createdAt | Date | Creation date |

### Example

```json
{
  "_id": "c001",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "email": "john@example.com"
}
```

---

## Sales Collection

### Purpose

Stores sales transactions.

### Fields

| Field | Type | Description |
|---------|---------|---------|
| _id | ObjectId | Unique identifier |
| customerId | ObjectId | Customer reference |
| productId | ObjectId | Product reference |
| quantitySold | Number | Quantity sold |
| amount | Number | Total amount |
| soldBy | ObjectId | User reference |
| saleDate | Date | Transaction date |

### Example

```json
{
  "_id": "s001",
  "customerId": "c001",
  "productId": "p001",
  "quantitySold": 3,
  "amount": 15000,
  "soldBy": "u001",
  "saleDate": "2026-07-07"
}
```

---

# Relationships

## User → Sales

One user can record many sales.

```text
User (1) ------ (M) Sales
```

---

## Customer → Sales

One customer can have many sales transactions.

```text
Customer (1) ------ (M) Sales
```

---

## Product → Sales

One product can appear in many sales records.

```text
Product (1) ------ (M) Sales
```

---

# Database Diagram

```text
Users
 ├── _id
 ├── name
 ├── email
 ├── password
 └── role

       |
       |
       ▼

Sales
 ├── _id
 ├── customerId
 ├── productId
 ├── quantitySold
 ├── amount
 ├── soldBy
 └── saleDate

 ▲                ▲
 |                |
 |                |

Customers      Products
 ├── _id       ├── _id
 ├── name      ├── name
 ├── phone     ├── category
 └── email     ├── price
               └── quantity
```

---

# Business Rules

1. Email addresses must be unique in the Users collection.
2. Product quantity cannot be negative.
3. Every sale must reference a valid product.
4. Every sale must reference a valid user.
5. Inventory quantity must decrease automatically when a sale is recorded.
6. Low stock alerts should be triggered when quantity falls below a predefined threshold.
7. Only authenticated users can access protected resources.

---

# Future Enhancements

- Receipt collection
- Supplier management
- Purchase orders
- Barcode support
- Multi-branch inventory management