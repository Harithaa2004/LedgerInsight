# Finance Data Processing and Access Control Backend

A backend system designed to manage financial records with role-based access control and dashboard analytics. This project demonstrates API design, data modeling, business logic, and access restriction based on user roles.

---

## Setup Instructions

1. Clone the repository

2. Install dependencies:
   npm install

3. Create a `.env` file in root:

   DB_HOST=localhost  
   DB_USER=root  
   DB_PASSWORD=yourpassword  
   DB_NAME=finance_db  

4. Start the server:
   node app.js

---

## Database Setup

Make sure MySQL is running and create the required database.

Example:
CREATE DATABASE finance_db;

Create tables as per your schema.

---

## Authentication

This project uses mock authentication via headers (no JWT).

Headers required for all APIs:
x-user-id: 1  
x-user-role: 0   (0 = Admin, 1 = Analyst, 2 = Viewer)

---

## Roles and Permissions

Admin (0): Full access — can create, read, update, delete records and manage users  
Analyst (1): Can view records and access analytics  
Viewer (2): Can only view dashboard summary  

---

## API Documentation

### Users (Admin only)

Create User  
POST /users  

Request Body:
{
  "name": "John",
  "email": "john@example.com",
  "role": 1,
  "isActive": true
}

Response:
{
  "message": "User created successfully"
}

Get Users  
GET /users  

---

### Financial Records

Create Record (Admin)  
POST /records  

Request Body:
{
  "amount": 500,
  "type": "expense",
  "category": "food",
  "date": "2026-04-06",
  "notes": "Lunch"
}

Get Records (Admin, Analyst)  
GET /records  

Query Params (optional):
type=income  
category=food  
startDate=2026-01-01  
endDate=2026-12-31  

Update Record (Admin)  
PUT /records/:id  

Delete Record (Admin - Soft Delete)  
DELETE /records/:id  

---

### Dashboard

Get Dashboard  
GET /dashboard  

Viewer Response:
{
  "totalIncome": 1000,
  "totalExpense": 500,
  "netBalance": 500
}

Analyst/Admin Response:
{
  "totalIncome": 1000,
  "totalExpense": 500,
  "netBalance": 500,
  "categoryTotals": [],
  "monthlyTrends": []
}

---

## Testing

Use Postman or any API client.

Set headers:
x-user-id: 1  
x-user-role: 0  

Test roles:
Admin → 0  
Analyst → 1  
Viewer → 2  

---

## Assumptions

- Authentication is mocked using request headers (no real authentication implemented)
- Each user can only access their own financial data
- Soft delete is implemented using isDeleted field
- Users can be activated or deactivated using isActive
- Role-based access control is enforced using middleware

---

## Additional Notes

- Clean separation of routes, controllers, and middleware
- Proper error handling and validation implemented
- Dashboard includes aggregated financial insights
- Designed for clarity, maintainability, and scalability

---

## Objective

This project is built to demonstrate backend development skills including API design, role-based access control, data handling, and system structuring.