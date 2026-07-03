# Authentication Flow

TechCart uses a stateless, token-based authentication mechanism using **JSON Web Tokens (JWT)**.

## 1. Backend Implementation
*   **Login/Register (`authController.ts`):** 
    When a user logs in or registers, the backend verifies the credentials (using bcrypt to compare password hashes). 
    Upon success, it generates a JWT containing the user's `id` and `role`.
*   **Token Generation:** Signed using a secret key (`JWT_SECRET`) with an expiration time (e.g., 30d).
*   **Middleware (`authMiddleware.ts`):**
    *   `protect`: Intercepts API requests, extracts the Bearer token from the `Authorization` header, verifies it, and attaches the `user` object to the request.
    *   `admin`: Checks if `req.user.role === 'admin'`. If not, access is denied.

## 2. Frontend Implementation
*   **Redux Store (`authSlice.ts`):** 
    Stores `userInfo` (which includes the token and user details).
    On initial load, it retrieves this data from browser `localStorage` to persist the session.
*   **API Interceptor (`api.ts`):** 
    Axios is configured with a request interceptor. Before any API call is made, it checks the Redux store (or localStorage) for a token. If found, it automatically attaches `Authorization: Bearer <token>` to the headers.
*   **Protected Routes:** 
    Pages like `Shipping`, `Payment`, and `Profile` use a `useEffect` hook to check if `userInfo` exists. If not, the user is redirected to `/login?redirect=/intended-page`.

## 3. Hydration Considerations
Because Redux initializes `userInfo` from `localStorage` (which is a Client-side only API), Next.js Server-Side Rendering (SSR) will not have access to it. This leads to a mismatch between Server HTML and Client HTML.
**Fix:** Protected UI elements (like the Header user avatar and checkout buttons) use a `mounted` state (`useState(false)` flipped to `true` in a `useEffect`) to ensure they only render user-specific data *after* the client has hydrated.
