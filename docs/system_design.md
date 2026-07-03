# System Design

## High-Level Architecture
TechCart follows a standard Client-Server architecture separated into two distinct repositories/folders:
1.  **Frontend (Next.js Application):** Handles the UI, Client-side routing, and State Management.
2.  **Backend (Express API):** Handles business logic, database operations, and authentication.

## Data Flow Diagram (Checkout Example)
```text
[Client: React/Next.js] 
       │
       ├─1. User clicks "Place Order"
       ├─2. Redux gathers Cart Items, Shipping Address, Payment Method
       │
       ▼
[Axios Interceptor] 
       ├─ Injects JWT Token into Headers
       │
       ▼
[Backend: Express.js API] (/api/orders)
       │
       ├─1. authMiddleware verifies JWT
       ├─2. orderController validates data against Mongoose Schema
       ├─3. orderController saves Order to MongoDB
       │
       ▼
[Database: MongoDB]
       │
       ▼
[Backend Response] 
       ├─ Returns Order ID and Status 201
       │
       ▼
[Client: React/Next.js]
       ├─ Redux clears cart items
       ├─ Router pushes to /order/[id]
```

## Component Architecture
*   **Server Components:** `layout.tsx`, `page.tsx` (Homepage). Used for static, SEO-friendly layouts.
*   **Client Components:** Any file starting with `'use client'`. Used for interactive components (Cart, Forms, Redux dispatchers).

## State Architecture (Redux)
*   **`store.ts`:** Combines reducers.
*   **`authSlice`:** Manages `{ userInfo, token }`.
*   **`cartSlice`:** Manages `{ cartItems, shippingAddress, paymentMethod }`. Calculates totals dynamically in the UI.
*   **`productSlice`:** Manages product fetching, loading states, and error handling for the catalog.
