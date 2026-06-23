# Dhrti - B2B Plastic Waste Marketplace

Dhrti is a comprehensive B2B marketplace designed to facilitate the circular economy by connecting plastic waste suppliers (collectors, aggregators) with buyers (manufacturers, recyclers). The platform offers a secure, intuitive, and responsive interface to manage listings, track requests, and monitor analytics.

### 🚀 Live Demo

Frontend:
https:dhrti-from-waste-to-purpose.vercel.app

Backend:
https://dhrti-backend.onrender.com

## Features

### For Suppliers
- **Marketplace Listings**: Create and manage detailed listings for different categories of waste (Recyclable Plastic, Paper, Metal).
- **Request Management**: Receive and respond to order requests from buyers.
- **Analytics Dashboard**: Track total listings, quantities sold, and active/draft/sold statuses with dynamic charts.
- **Profile Management**: Update company details, GST information, and location.

### For Buyers
- **Search & Filter**: Browse the marketplace with advanced filters (category, quantity, location).
- **Saved Listings**: Bookmark listings for quick access.
- **Order Requests**: Submit procurement requests to suppliers.
- **Analytics Dashboard**: Monitor pending, accepted, and completed requests over time.
- **Procurement Preferences**: Set and update specific procurement needs to streamline sourcing.

## Tech Stack

**Frontend**
- React 19 (Vite)
- TypeScript
- Tailwind CSS & Framer Motion (Styling and Animations)
- React Query (Data Fetching & Caching)
- React Hook Form & Zod (Form Validation)
- Recharts (Analytics Data Visualization)
- Lucide React (Icons)

**Backend**
- Node.js & Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT) Authentication
- Bcrypt (Password Hashing)

## Folder Structure

```
dhrti/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application routes and pages
│   │   ├── services/       # API integration layers
│   │   └── types/          # TypeScript interface definitions
│   └── vite.config.ts      # Vite configuration
│
└── server/                 # Backend Node.js API
    ├── config/             # DB configuration
    ├── controllers/        # Route controllers
    ├── middleware/         # Express middleware (Auth, Error handling)
    ├── models/             # Mongoose schemas
    ├── routes/             # API routing
    ├── utils/              # Utilities (JWT, Bcrypt)
    └── server.js           # Application entry point
```

## Installation & Local Development

### 1. Clone the repository
```bash
git clone <repository-url>
cd dhrti
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the seed script to populate initial data (Optional):
```bash
npm run seed
```

Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

## Deployment Instructions

### Frontend (Vercel)
1. Push your code to a Git repository.
2. Import the project in Vercel.
3. Set the Root Directory to `client`.
4. Ensure the Framework Preset is set to `Vite`.
5. Add the Environment Variable `VITE_API_URL` pointing to your deployed backend API URL.
6. Click Deploy.

### Backend (Render / Railway)
1. Import the project in Render or Railway.
2. Set the Root Directory to `server`.
3. Set the Start Command to `npm start`.
4. Add the required Environment Variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).
5. Deploy the application.

## Demo Accounts

You can use the following credentials to test the platform:

**Supplier Account**
- **Email**: supplier@demo.dhrti.local
- **Password**: demo1234

**Buyer Account**
- **Email**: buyer@demo.dhrti.local
- **Password**: demo1234

## Developer

Pavan Sushil Wattamwar

B.Tech Computer Science & Engineering
VIT-AP University

LinkedIn:
https://www.linkedin.com/in/pavan-wattamwar-tech

GitHub:
https://github.com/P-gifavan
