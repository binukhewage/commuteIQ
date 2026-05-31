# CommuteIQ 🚗⛽

Smart fuel and travel analytics dashboard built with Next.js and Supabase.

---

## ✨ Features

### 🔐 Authentication
- Email signup/login
- Secure Supabase authentication
- Protected routes

---

### ⛽ Fuel Tracking
- Add fuel purchases
- Track litres pumped
- Track amount spent
- Current fuel price management
- Remaining fuel calculation

---

### 🚗 Trip Tracking
- Office & personal trips
- Highway & normal travel tracking
- Distance tracking
- KM/L efficiency tracking
- Manual trip dates
- Trip notes
- Automatic fuel usage calculation
- Automatic trip cost calculation
- Delete trips

---

### 📊 Dashboard Analytics
- Current fuel price
- Remaining fuel balance
- Monthly spending
- Predicted monthly cost
- Monthly litres used
- Total KM travelled
- Office vs personal analytics
- Highway vs normal analytics

---

### 📈 Charts
- Monthly spending trend chart
- Office vs personal pie chart

---

# 🛠 Tech Stack

## Frontend
- Next.js 16
- React
- Tailwind CSS
- shadcn/ui
- Recharts

---

## Backend
- Supabase
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)

---

# 📂 Project Structure

```bash
src/
│
├── app/
│   ├── login/
│   ├── signup/
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── fuel/
│   │   └── trips/
│
├── components/
│   ├── dashboard/
│   ├── ui/
│   └── Sidebar.jsx
│
├── lib/
│   ├── supabase.js
│   └── utils.js
│
└── app/globals.css
```

---

# ⚙️ Environment Variables

Create:

```env
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

# 🗄 Database Tables

## fuel_purchases
Stores:
- litres purchased
- amount spent

---

## trips
Stores:
- trip category
- route type
- trip date
- distance
- fuel efficiency
- litres used
- trip cost

---

## fuel_settings
Stores:
- current fuel price

---

# 🚀 Installation

## Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# 🔒 Security

- Supabase Row Level Security (RLS) enabled
- User-specific data isolation
- Protected authenticated routes

---

# 📦 Deployment

## Frontend
Hosted on Vercel

## Backend
Hosted on Supabase

---

# 🧠 Core Calculations

## Fuel Used

```txt
Fuel Used = Distance / KM Per Litre
```

---

## Trip Cost

```txt
Trip Cost = Fuel Used × Fuel Price
```

---

## Remaining Fuel

```txt
Remaining Fuel = Total Fuel Purchased - Total Fuel Used
```

---

## Predicted Monthly Cost

```txt
Predicted Monthly Cost =
(Current Month Spending / Days Passed) × 30
```

---


Built with  using Next.js + Supabase.
