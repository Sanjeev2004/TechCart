# TechCart E-Commerce Platform

TechCart is a full-stack, premium E-Commerce web application built using the MERN stack (MongoDB, Express, React/Next.js, Node.js) with a modern App Router Next.js frontend.

## 🚀 Tech Stack

### Frontend
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (with custom animations and gradients)
*   **State Management:** Redux Toolkit (`authSlice`, `cartSlice`, `productSlice`)
*   **Icons:** Lucide React
*   **Form Validation:** React Hook Form & Zod

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** JWT (JSON Web Tokens) & bcryptjs
*   **Language:** TypeScript

## ✨ Key Features
*   **Product Catalog:** Browse products, view details, stock status, and ratings.
*   **Shopping Cart:** Add/remove items, update quantities, persistent state via localStorage.
*   **Checkout Flow:** Shipping address validation, payment method selection, order summary.
*   **Authentication:** User registration, login, and secure JWT-based sessions.
*   **Admin Dashboard:** Manage users, products, categories, and orders.
*   **Responsive UI:** Premium, glassmorphic design optimized for mobile and desktop.

## 🛠️ Setup Instructions

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed.

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed  # To populate database with sample Indian Rupee data
npm run dev   # Starts server on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts Next.js on port 3000
```

Open `http://localhost:3000` to view the application.
