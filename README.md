# 📦 Inventory Management System

A full-stack Warehouse Management System built with **.NET 8 Web API** and **React**. This application allows administrators to track inventory, manage stock levels, and visualize warehouse analytics.

## 🚀 Features

### 🛡️ Authentication & Security
- **Secure Login/Register:** Powered by JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC):** - **Admins:** Can Add, Edit, Delete products and view all stats.
  - **Users:** Read-only access to the dashboard.
- **Password Hashing:** BCrypt implementation for security.

### 📊 Dashboard & Analytics
- **Real-time Stats:** Cards showing Total Inventory Value, Product Count, and Low Stock Alerts.
- **Smart Data Visualization:** - Visual badges for "In Stock" vs "Low Stock".
  - Clean, responsive UI with Bootstrap 5.

### ⚡ Data Management
- **Server-Side Search:** Efficient filtering of database records.
- **Server-Side Pagination:** Optimized for large datasets.
- **CRUD Operations:** Full Create, Read, Update, Delete capabilities.

---

## 🛠️ Tech Stack

**Backend:**
- C# / .NET 8 Web API
- Entity Framework Core (EF Core)
- SQL Server
- LINQ (for Search/Pagination logic)

**Frontend:**
- React.js (Hooks, Context API)
- Axios (API Communication)
- Bootstrap 5 (Responsive UI)
- React Icons

---

## ⚙️ How to Run Locally

### 1. Backend Setup
1. Clone the repo.
2. Open `appsettings.json` and update the Connection String to your local SQL Server.
3. Run migrations:
   ```bash
   dotnet ef database update
