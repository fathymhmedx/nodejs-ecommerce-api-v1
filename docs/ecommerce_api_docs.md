# 🛍️ Node.js E-commerce API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-yellow)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-blue)](https://stripe.com/)
[![Redis](https://img.shields.io/badge/Redis-Caching-red)](https://redis.io/)
[![Multer](https://img.shields.io/badge/Multer-FileUpload-blueviolet)](https://www.npmjs.com/package/multer)
[![Sharp](https://img.shields.io/badge/Sharp-ImageOptimization-orange)](https://www.npmjs.com/package/sharp)
[![Helmet](https://img.shields.io/badge/Helmet-Security-lightgrey)](https://www.npmjs.com/package/helmet)
[![JWT](https://img.shields.io/badge/JWT-Authentication-blue)](https://www.npmjs.com/package/jsonwebtoken)
[![Bcrypt](https://img.shields.io/badge/Bcrypt-Hashing-red)](https://www.npmjs.com/package/bcryptjs)
[![Express Validator](https://img.shields.io/badge/ExpressValidator-Validation-yellowgreen)](https://www.npmjs.com/package/express-validator)
[![Compression](https://img.shields.io/badge/Compression-Performance-lightblue)](https://www.npmjs.com/package/compression)
[![CORS](https://img.shields.io/badge/CORS-CrossOrigin-lightgreen)](https://www.npmjs.com/package/cors)
[![Cookie Parser](https://img.shields.io/badge/CookieParser-Cookies-lightgrey)](https://www.npmjs.com/package/cookie-parser)
[![Morgan](https://img.shields.io/badge/Morgan-Logging-yellow)](https://www.npmjs.com/package/morgan)
[![UUID](https://img.shields.io/badge/UUID-UniqueID-purple)](https://www.npmjs.com/package/uuid)
[![Pluralize](https://img.shields.io/badge/Pluralize-Helpers-orange)](https://www.npmjs.com/package/pluralize)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Emails-blue)](https://www.npmjs.com/package/nodemailer)
[![Slugify](https://img.shields.io/badge/Slugify-SEO-orange)](https://www.npmjs.com/package/slugify)
[![HPP](https://img.shields.io/badge/HPP-HTTPProtection-lightgrey)](https://www.npmjs.com/package/hpp)
[![Express Rate Limit](https://img.shields.io/badge/RateLimiter-Security-red)](https://www.npmjs.com/package/express-rate-limit)
[![Nodemon](https://img.shields.io/badge/Nodemon-DevTool-lightblue)](https://www.npmjs.com/package/nodemon)


---

## 💡 Overview

* **Modular Architecture**: controllers, models, routes, services per module
* **Factory Handlers**: CRUD operations reusable across models
* **Rate Limiter Factory**: applied per sensitive endpoint
* **Validation**: all modules with Mongoose schema & custom validators
* **Plugins & Middlewares**: slugifyPlugin, imageUrlPlugin, preMiddlewares
* **Production Logging**: Morgan logs to files
* **JWT Authentication & Role-based Access Control**
* **File Uploads**: Multer + image optimization
* **Stripe Integration**: checkout sessions, webhook, order creation
* **Full E-commerce Features**: cart, wishlist, coupons, multi-address, orders, reviews
* **Products Redise with Redis**: top 10, latest, top-rated, related products are cached for performance

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development
npm run start:dev

# Run in production
npm run start:prod
```

## 🔧 Environment Variables (.env)

The project requires a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=8000

#Database
DB_URI=mongodb+srv://Fathymohamed11:<db_password>@cluster0.q1fuprp.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0
DB_PASS=YOUR_DB_PASSWORD

# Allow all origins (only for development)
CLIENT_URL=*

#BaseURLImage
BASE_URL=http://localhost:8000

#JWT
JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET_KEY=YOUR_JWT_REFRESH_SECRET_KEY
JWT_REFRESH_EXPIRES_IN=7d

#Email Settings
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=YOUR_EMAIL_USER
EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD
EMAIL_FROM_NAME=E-shop
EMAIL_FROM=fathymohamed11@gmail.com

#Stripe Settings
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET
STRIPE_WEBHOOK_SECRET_KEY=YOUR_STRIPE_WEBHOOK_SECRET

#Redis settings
REDIS_URL=YOUR_REDIS_URL

```

---

## 🔐 JWT Authentication & Role-based Access Control

* **Access Token**:

  * Short-lived (15 minutes)
  * Used to access protected endpoints
  * Sent via header: `Authorization: Bearer <access_token>`

* **Refresh Token**:

  * Long-lived (7 days)
  * Used to get a new Access Token without login
  * Sent to endpoint `/auth/refresh-token` to renew token

* **Roles**: `Admin`, `Manager`, `User`

  * Controls access to sensitive endpoints: Users, Orders, Products, Coupons

**Pro-level Notes:**

* Tokens are encrypted with `JWT_SECRET_KEY` and `JWT_REFRESH_SECRET_KEY`
* Refresh token can be stored in HttpOnly cookie or local storage
* Full protection on all CRUD operations and sensitive models

---


**Base URL:** `{{BASE_URL}}/api/v1`
**Authentication:** Bearer Token (JWT)
**Total Endpoints:** 90+

---

## 🔐 Authentication & Authorization

| Method | Endpoint                | Description                               | Access  |
| ------ | ----------------------- | ----------------------------------------- | ------- |
| POST   | `/auth/signup`          | Register new user                         | Public  |
| POST   | `/auth/login`           | Login user, issue access & refresh tokens | Public  |
| POST   | `/auth/logout`          | Logout user, clear refresh token cookie   | Private |
| GET    | `/auth/refresh-token`   | Get new access token using refresh token  | Private |
| POST   | `/auth/password/forgot` | Request password reset code via email     | Public  |
| POST   | `/auth/password/verify` | Verify password reset code                | Public  |
| POST   | `/auth/password/reset`  | Reset password using verified code        | Public  |

> **Note:** AccessToken expires in 15m, RefreshToken expires in 7d, stored in httpOnly cookie.

---

## 👤 Users

| Method | Endpoint                | Description                   | Access/Role   |
| ------ | ----------------------- | ----------------------------- | ------------- |
| GET    | `/users`                | Get all users                 | Admin/Manager |
| POST   | `/users`                | Create new user               | Admin         |
| GET    | `/users/me`             | Get logged-in user profile    | User          |
| PUT    | `/users/me`             | Update profile                | User          |
| PUT    | `/users/me/password`    | Change password               | User          |
| PUT    | `/users/me/deactivate`  | Deactivate my account         | User          |
| PUT    | `/users/:id/deactivate` | Deactivate user by admin      | Admin         |
| PUT    | `/users/:id/reactivate` | Reactivate user by admin      | Admin         |
| PUT    | `/users/:id/password`   | Change user password by admin | Admin         |
| GET    | `/users/:id`            | Get specific user by admin    | Admin         |
| PUT    | `/users/:id`            | Update user by admin          | Admin         |
| DELETE | `/users/:id`            | Delete user                   | Admin         |

---

## 📦 Categories

| Method | Endpoint          | Description         | Access/Role   |
| ------ | ----------------- | ------------------- | ------------- |
| GET    | `/categories`     | Get all categories  | Public        |
| POST   | `/categories`     | Create new category | Admin/Manager |
| GET    | `/categories/:id` | Get category by ID  | Public        |
| PUT    | `/categories/:id` | Update category     | Admin/Manager |
| DELETE | `/categories/:id` | Delete category     | Admin         |

### SubCategories

| Method | Endpoint             | Description           | Access/Role   |
| ------ | -------------------- | --------------------- | ------------- |
| GET    | `/subcategories`     | Get all subcategories | Public        |
| POST   | `/subcategories`     | Create subcategory    | Admin/Manager |
| GET    | `/subcategories/:id` | Get subcategory by ID | Public        |
| PUT    | `/subcategories/:id` | Update subcategory    | Admin/Manager |
| DELETE | `/subcategories/:id` | Delete subcategory    | Admin         |

**Nested Routes:**

| Method | Endpoint                                | Description                       |
| ------ | --------------------------------------- | --------------------------------- |
| GET    | `/categories/:categoryId/subcategories` | Get subcategories for a category  |
| POST   | `/categories/:categoryId/subcategories` | Create subcategory under category |

---

## 🏷️ Brands

| Method | Endpoint      | Description     | Access/Role   |
| ------ | ------------- | --------------- | ------------- |
| GET    | `/brands`     | List all brands | Public        |
| POST   | `/brands`     | Create brand    | Admin/Manager |
| GET    | `/brands/:id` | Get brand by ID | Public        |
| PUT    | `/brands/:id` | Update brand    | Admin/Manager |
| DELETE | `/brands/:id` | Delete brand    | Admin         |

---

## 🛒 Cart

| Method | Endpoint             | Description               | Access/Role |
| ------ | -------------------- | ------------------------- | ----------- |
| GET    | `/cart`              | Get logged user's cart    | User        |
| POST   | `/cart`              | Add product to cart       | User        |
| PUT    | `/cart/:itemId`      | Update cart item quantity | User        |
| DELETE | `/cart/:itemId`      | Remove cart item          | User        |
| DELETE | `/cart/clear`        | Clear entire cart         | User        |
| PUT    | `/cart/apply-coupon` | Apply coupon              | User        |

---

## 🛒 Orders

| Method | Endpoint                           | Description             | Access/Role   |
| ------ | ---------------------------------- | ----------------------- | ------------- |
| POST   | `/orders/:cartId`                  | Create cash order       | User          |
| GET    | `/orders/me`                       | Get my orders           | User          |
| GET    | `/orders/me/:id`                   | Get my order by ID      | User          |
| GET    | `/orders`                          | Get all orders          | Admin/Manager |
| GET    | `/orders/checkout-session/:cartId` | Stripe checkout session | User          |
| PUT    | `/orders/:id/pay`                  | Mark order as paid      | Admin/Manager |
| PUT    | `/orders/:id/deliver`              | Mark order as delivered | Admin/Manager |

> **Note:** Both Stripe checkout orders and cash orders use atomic order creation to prevent duplicates. Stripe uses `stripeSessionId`, and cash orders ensure uniqueness by validating cart contents and order records before creation.

---

## 🛍️ Products

| Method | Endpoint                | Description        | Access/Role   |
| ------ | ----------------------- | ------------------ | ------------- |
| GET    | `/products`             | Get all products   | Public        |
| GET    | `/products/:id`         | Get product by ID  | Public        |
| POST   | `/products`             | Create product     | Admin/Manager |
| PUT    | `/products/:id`         | Update product     | Admin/Manager |
| DELETE | `/products/:id`         | Delete product     | Admin         |
| GET    | `/products/top-ten`     | Top 10 products    | Public        |
| GET    | `/products/latest`      | Latest products    | Public        |
| GET    | `/products/top-rated`   | Top rated products | Public        |
| GET    | `/products/:id/related` | Related products   | Public        |

---

## ⭐ Reviews

| Method | Endpoint                                 | Description         | Access/Role        |
| ------ | ---------------------------------------- | ------------------- | ------------------ |
| GET    | `/reviews`                               | Get all reviews     | Public             |
| GET    | `/reviews/:id`                           | Get review by ID    | Public             |
| POST   | `/products/:productId/reviews`           | Add review          | User               |
| GET    | `/products/:productId/reviews`           | Get product reviews | Public             |
| GET    | `/products/:productId/reviews/:reviewId` | Get single review   | Public             |
| PUT    | `/reviews/:id`                           | Update review       | User               |
| DELETE | `/reviews/:id`                           | Delete review       | User/Admin/Manager |

---

## 💝 Wishlist

| Method | Endpoint               | Description             | Access/Role |
| ------ | ---------------------- | ----------------------- | ----------- |
| GET    | `/wishlist`            | Get my wishlist         | User        |
| POST   | `/wishlist`            | Add product to wishlist | User        |
| DELETE | `/wishlist/:productId` | Remove from wishlist    | User        |

---

## 📍 Addresses

| Method | Endpoint                | Description      | Access/Role |
| ------ | ----------------------- | ---------------- | ----------- |
| GET    | `/addresses`            | Get my addresses | User        |
| POST   | `/addresses`            | Add new address  | User        |
| DELETE | `/addresses/:addressId` | Remove address   | User        |

---

## 🎟️ Coupons

| Method | Endpoint                  | Description       | Access/Role   |
| ------ | ------------------------- | ----------------- | ------------- |
| GET    | `/coupons`                | Get all coupons   | Admin/Manager |
| POST   | `/coupons`                | Create coupon     | Admin/Manager |
| GET    | `/coupons/:id`            | Get coupon by ID  | Admin/Manager |
| PUT    | `/coupons/:id`            | Update coupon     | Admin/Manager |
| DELETE | `/coupons/:id`            | Delete coupon     | Admin/Manager |
| PATCH  | `/coupons/activate/:id`   | Activate coupon   | Admin/Manager |
| PATCH  | `/coupons/deactivate/:id` | Deactivate coupon | Admin/Manager |

---

## 💰 Pricing Settings

| Method | Endpoint    | Description             | Access/Role |
| ------ | ----------- | ----------------------- | ----------- |
| GET    | `/settings` | Get pricing settings    | Admin       |
| PUT    | `/settings` | Update pricing settings | Admin       |

---

> ✅ All endpoints follow **JWT Authentication & Role-based Access Control**.
> 🔒 Refresh token & access token mechanism implemented for secure session handling.
> ⚡ Stripe checkout & webhook handle **atomic operations** to prevent overselling.


## ⚡ Stripe Webhook Integration (Local Testing)

### 1️⃣ Run Backend

```bash
npm run start:dev
```

### 2️⃣ Run Stripe CLI

```bash
stripe listen --forward-to localhost:8000/webhook-checkout
```

> Connects Stripe to `/webhook-checkout` endpoint locally.

### 3️⃣ Trigger Checkout Session

```bash
stripe trigger checkout.session.completed \
  --add checkout_session:client_reference_id=<CART_ID> \
  --add checkout_session:metadata[userId]=<USER_ID>
```

> Replace `<CART_ID>` and `<USER_ID>` with real database values.

### 4️⃣ Verify

* Check console logs:

```
Checkout Session Completed: cs_test_...
Cart ID: ...
User ID: ...
Order created from Stripe webhook: ...
```

* Order is created, stock updated, cart cleared.
* Duplicate sessions ignored to prevent multiple orders.

### 5️⃣ Notes

* Logs appear only in `development mode`.
* Transactions are atomic to prevent overselling.
* Webhook ready for production, use correct Stripe secret in `.env`.

---

## 🏗️ Architecture & Skills

* **Factory Handlers** for all CRUD operations
* **Rate Limiter Factory** reusable for any module
* **Validation** for all models & inputs
* **Plugins**: slugifyPlugin, imageUrlPlugin
* **Pre-Middlewares & Model Methods** for pre-save, pre-update, computed fields
* **Modular Project Structure**
* **Production Logging** with `morgan` and file streams

---

## 🎯 Key Features

### ✅ Authentication & Security
- JWT-based authentication with refresh tokens
- Password reset via email verification code
- Account deactivation/reactivation
- Role-based access control (Admin, Manager, User)

### ✅ Advanced Product Management
- Multi-image upload support
- Product variants (colors, sizes)
- Stock quantity tracking
- Related products suggestions
- Top-rated, latest, and top 10 products

### ✅ E-commerce Features
- Shopping cart with coupon support
- Wishlist functionality
- Multiple shipping addresses
- Cash and online payment (Stripe)
- Order tracking and status management

### ✅ Reviews & Ratings
- User reviews on products
- Rating system (1-5 stars)
- Review ownership validation

### ✅ Advanced Querying
- Pagination support
- Field selection
- Keyword search
- Sorting (ascending/descending)
- Filtering by multiple criteria

### ✅ Admin Features
- Complete user management
- Coupon management with activation/deactivation
- Order status management (paid/delivered)
- Pricing settings (tax & shipping)
- Product, category, brand CRUD operations

### ✅ File Upload Support
- Category images
- Brand logos
- Product images (cover + gallery)
- User profile pictures
- Multipart/form-data handling

---

## 🌐 Connect with Me

[![Facebook](https://img.shields.io/badge/Facebook-Profile-blue?logo=facebook\&logoColor=white)](https://www.facebook.com/fathy.mohamed.450342/)
[![Gmail](https://img.shields.io/badge/Gmail-Email-red?logo=gmail\&logoColor=white)](mailto:fathymhmed11@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/fathymohamed11/)

