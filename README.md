# 🛒 nodejs-ecommerce-api-v1

Ecommerce RESTful API built with **Node.js**, **Express.js**, and **MongoDB** following a clean modular architecture.

> 🚧 This project is currently under active development. More features will be added soon.

---

## 📁 Project Structure
    Monolithic Modular Architecture
    
```
├── src/
│   ├── app.js                          # Express app configuration (middlewares, routes…)
│   │
│   ├── modules/                        # Business logic (Modular Architecture)
│   │   ├── auth/                       # Auth, JWT, login/register, protect routes
│   │   ├── brand/                      # Brand CRUD
│   │   ├── category/                   # Category CRUD
│   │   ├── subCategory/                # Sub-category CRUD
│   │   ├── product/                    # Product CRUD, filtering, search, pagination
│   │   └── user/                       # User CRUD, profile, passwords
│   │
│   ├── shared/
│   │   ├── config/                     # Database connection, logger setup
│   │   ├── errors/                     # Custom ApiError class & global error handler
│   │   ├── middlewares/                # Auth, validators, rate limiting, uploads
│   │   └── utils/                      # API features (filter, paginate…), dummy data, helpers
│   │
│   ├── routes/                         # Entry point for all module routes
│   │   └── index.js
│   │
│   └── uploads/                        # Uploaded images (users, products, etc.)
│
├── server.js                           # App entry point + DB initialization
├── package.json
├── README.md
└── config.env                           # Environment variables
---

## 🧪 Tech Stack

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** Authentication
- **Helmet**, **CORS**
- **dotenv**, **Morgan**
- **Express-validator**, **Prettier**, **ESLint**

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fathymhmedx/nodejs-ecommerce-api-v1.git
cd nodejs-ecommerce-api-v1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `config.env` file

Add your environment variables in a file named `config.env` at the root:
# ============================
# Environment Configuration

# Set the environment mode: 'development' or 'production'
NODE_ENV=development

# Port on which the server will run
PORT=8000

# ============================
#  MongoDB Configuration

# MongoDB connection URI.
# Replace <DB_USER> and <DB_PASS> with your actual MongoDB Atlas credentials.
DB_URI=mongodb+srv://<DB_USER>:<DB_PASS>@cluster0.mongodb.net/Ecommerce?retryWrites=true&w=majority

# MongoDB password
DB_PASS=your_mongodb_password

# ============================
#  Frontend Configuration

# URL of your frontend client (React, etc.)
CLIENT_URL=http://localhost:3000

# ============================
#  JWT Authentication

# Secret key to sign JWT tokens (use a strong random string)
JWT_SECRET=your_jwt_secret

# JWT expiration time (e.g., 30d = 30 days)
JWT_EXPIRES_IN=30d


> 🛑 **Note:** Never commit this file or share it publicly.

### 4. Run the development server

```bash
npm run start:dev
```

---

## 🔐 Security Tips

- Add `.env` or `config.env` to `.gitignore`:

```bash
# .gitignore
.env
config.env
```

- Never hardcode sensitive values in your source files.
- Regenerate DB passwords/secrets if shared or exposed.

---

## 📌 Project Status

> This is **v1** of the ecommerce backend. The following features are complete:

- [x] Auth & JWT
- [x] Categories / Brands / Products / users / subcategories CRUD
- [x] MongoDB filtering, sorting, pagination
- [x] Modular structure with Repository pattern
- [x] Input validation
- [x] Global error handler
- [x] Dummy data seeding

> Upcoming:
- [ ] Cart / Wishlist
- [ ] Orders & Checkout
- [ ] Reviews
- [ ] Payment integration
- [ ] Admin dashboard & roles

---

## 👨‍💻 Author

Developed by [Fathy Mohamed](mailto:fathymhmed11@gmail.com)

