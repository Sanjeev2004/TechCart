# TechCart - Interview Questions & Answers

If you are presenting this project in an interview, here are common questions you might be asked:

### 1. How did you handle state management across the application?
**Answer:** I used **Redux Toolkit (RTK)**. I separated the state into slices (`cartSlice`, `authSlice`, `productSlice`). For persistence, I synced the Redux state with `localStorage` (e.g., `cartItems` and `userInfo`), so if the user refreshes the page, their cart and login session remain intact.

### 2. How did you solve Hydration Errors in Next.js?
**Answer:** Since Redux initializes data from `localStorage` (like `cartItems` or `userInfo`), the initial HTML rendered on the Next.js server (where `localStorage` is undefined) differed from the React client render. This caused React Hydration errors. I fixed this by introducing a `mounted` state. I set `const [mounted, setMounted] = useState(false)` and updated it to `true` inside a `useEffect`. I then conditionally rendered the user-specific UI or Cart data only when `mounted` was true.

### 3. Explain the Checkout Flow architecture.
**Answer:** The checkout flow is a multi-step process:
1. **Cart:** User manages quantities. On checkout, if they aren't logged in, they are redirected to login with a `?redirect=/shipping` query parameter.
2. **Shipping & Payment:** Data is collected and saved into the Redux store (`saveShippingAddress`, `savePaymentMethod`).
3. **Place Order:** The frontend aggregates the cart items, calculates totals (tax, shipping), and sends a POST request to the backend. Upon success, the Redux cart is cleared, and the user is redirected to the Order Summary page.

### 4. How did you secure your API routes?
**Answer:** I implemented custom Express middleware. The `protect` middleware verifies the JWT sent in the `Authorization` header. If valid, it attaches the user to the request. The `admin` middleware runs after `protect` and ensures `req.user.role === 'admin'`.

### 5. Why use Next.js App Router over the traditional Pages router?
**Answer:** The App Router offers better performance via Server Components by default, which reduces the client-side JavaScript bundle. It also provides nested routing and built-in layouts (`layout.tsx`), which made structuring the Header and Footer across the E-Commerce site much cleaner.
