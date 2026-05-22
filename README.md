# Semes Shop - MERN Stack E-Commerce

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (JWT) with role-based access (user/admin)
- Product browsing with search, filters, category, and pagination
- Shopping cart and checkout
- Order placement and status tracking
- Wishlist system
- Admin dashboard (products, orders, users, analytics)
- Dark/light mode
- Responsive modern UI with Framer Motion animations

## Project Structure

```
semes/
├── backend/          # Node.js + Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seed.js
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── components/
        ├── context/
        ├── layouts/
        ├── pages/
        ├── services/
        └── utils/
```

## Prerequisites

- Node.js 18+
- MongoDB (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set your MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/semes-ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

**MongoDB Atlas:** Create a free cluster, add a database user, whitelist your IP (or `0.0.0.0/0` for dev), and paste the connection string into `MONGODB_URI`.

Seed the database with sample products and demo users:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

API runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` (proxies `/api` to backend).

Optional: create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Accounts

After running `npm run seed` in backend:

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@semes.com  | admin123  |
| User  | user@semes.com   | user123   |

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)
- `GET /api/auth/wishlist` (protected)
- `POST /api/auth/wishlist/:productId` (protected)

### Products
- `GET /api/products` (search, category, pagination)
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart
- `POST /api/cart/add` (protected)
- `GET /api/cart` (protected)
- `PUT /api/cart/:id` (protected)
- `DELETE /api/cart/:id` (protected)

### Orders
- `POST /api/orders` (protected)
- `GET /api/orders/user` (protected)
- `GET /api/orders` (admin)
- `PUT /api/orders/:id` (admin)
- `GET /api/orders/analytics` (admin)

## Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

Serve the `frontend/dist` folder with a static host or configure Express to serve it.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, React Hot Toast

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, cors, dotenv
