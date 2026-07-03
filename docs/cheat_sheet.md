# TechCart Cheat Sheet

## 💻 Terminal Commands

**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

**Seed Database (Reset data to Indian Rupees):**
```bash
cd backend
npx ts-node src/seed.ts
```

## 🔗 Key API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & get token | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `GET` | `/api/products` | Get all products (supports `?keyword=`) | No |
| `GET` | `/api/products/:id` | Get single product details | No |
| `POST` | `/api/orders` | Create a new order | Yes (User) |
| `GET` | `/api/orders/:id` | Get order details | Yes (User) |
| `PUT` | `/api/orders/:id/deliver` | Mark order as delivered | Yes (Admin) |

## 📦 Redux Actions
Common dispatches you might need:

**Auth:**
*   `dispatch(setCredentials(userData))` - Log user in
*   `dispatch(logout())` - Clear session

**Cart:**
*   `dispatch(addToCart(item))` - Add or update quantity
*   `dispatch(removeFromCart(id))` - Remove item
*   `dispatch(saveShippingAddress(data))` - Save address
*   `dispatch(clearCartItems())` - Empty cart after checkout
