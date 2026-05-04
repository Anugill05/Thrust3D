# Print3D – Full-Stack 3D Printing Service Platform
> Production-ready MERN stack platform with admin dashboard, Razorpay payments, file upload, and premium UI.

## Quick Start

### 1. Setup Backend
```bash
cd server
npm install
# Edit .env with your MongoDB URI (required)
npm run seed      # populate sample data
npm run dev       # starts on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev       # starts on http://localhost:5173
```

## Login Credentials (after seeding)
| Role  | Email                  | Password      |
|-------|------------------------|---------------|
| Admin | admin@print3d.com      | Admin@123456  |
| User  | rohit@example.com      | User@123456   |

## URLs
| URL                           | Description         |
|-------------------------------|---------------------|
| http://localhost:5173         | Main website        |
| http://localhost:5173/admin   | Admin dashboard     |
| http://localhost:5000/api/health | API health check |

## Environment Variables (server/.env)
- `MONGODB_URI` – **Required**. MongoDB Atlas connection string
- `JWT_SECRET` – **Required**. Long random secret (min 32 chars)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` – Optional. App runs in mock mode without them
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – Used by seed script

## Payment Testing
Without Razorpay keys → app uses **mock mode** (auto-success after 1.5s).  
With real keys → use Razorpay test card `4111 1111 1111 1111`, any future date, OTP `123456`.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Redux Toolkit
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT Bearer tokens
- **Payments**: Razorpay (mock mode included)
- **Upload**: Multer (STL, OBJ, 3MF, STEP)
- **Charts**: Recharts (admin dashboard)

## Features
- Homepage with hero, materials, gallery, testimonials
- Product listing with filters, search, pagination
- Product detail with bulk pricing calculator
- Cart with persistent localStorage
- Checkout with Razorpay payment
- Order history & tracking timeline
- Design file upload (STL/OBJ)
- Admin dashboard with revenue charts
- Admin CRUD: products, orders, users, contacts
- WhatsApp floating button
- Mobile responsive

## Deploy
- **Backend**: Railway / Render (set env vars, deploy `/server`)
- **Frontend**: Vercel / Netlify (set `VITE_API_URL`, deploy `/client`, build cmd: `npm run build`)
- **Database**: MongoDB Atlas (free tier works)
