# Database Architecture

TechCart uses **MongoDB** as its NoSQL database, with **Mongoose** as the Object Data Modeling (ODM) library. The schema is designed for scalability and clear relationships.

## 1. User Model (`User.ts`)
Stores customer and admin credentials.
*   `name`: String
*   `email`: String (Unique)
*   `password`: String (Hashed via bcrypt)
*   `role`: String (Enum: `'user'`, `'admin'`) - defaults to `'user'`

## 2. Product Model (`Product.ts`)
Stores product details and inventory.
*   `name`, `description`, `brand`, `sku`: String
*   `price`: Number (Stored in INR ₹)
*   `stock`: Number (Inventory tracking)
*   `images`: Array of `{ url, public_id }`
*   `categorySlug`: String (References Category)
*   `ratings`: Number (Average rating)
*   `numOfReviews`: Number

## 3. Category Model (`Category.ts`)
Manages product organization.
*   `name`: String
*   `slug`: String (Unique, used in URLs)
*   `description`: String

## 4. Order Model (`Order.ts`)
Handles the complete checkout lifecycle.
*   `user`: ObjectId (References `User`)
*   `orderItems`: Array of `{ product (ObjectId), name, quantity, image, price }`
*   `shippingAddress`: `{ street, city, state, zipCode, country }`
*   `paymentMethod`: String (e.g., 'Stripe')
*   `paymentResult`: Object (Stores payment gateway response)
*   `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice`: Number
*   `isPaid`, `isDelivered`: Boolean
*   `orderStatus`: String (`Processing`, `Shipped`, `Delivered`, `Cancelled`)

## Database Seeding
The backend includes a `seed.ts` script that wipes the database and inserts predefined Categories, Products (with realistic INR prices * 83 multiplier), and a default Admin user (`admin@techcart.com`).
