# 🏢 WorkSpace Booking

A simple workspace reservation platform built with **Node.js + Express + MongoDB** (backend) and a single **HTML file** with inline CSS/JS (frontend).

## 📁 Project Structure

```
workspace-booking/
├── server.js      # Express + Mongoose backend
├── index.html     # Single-page frontend (inline CSS + JS)
└── README.md
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install express mongoose cors
```

### 2. Make sure MongoDB is running locally
```bash
# MongoDB should be running on mongodb://localhost:27017
```

### 3. Start the Server
```bash
node server.js
```

### 4. Open in Browser
```
http://localhost:3000
```

On first run, 6 sample spaces are seeded automatically into the database.

---

## ✨ Features

- **Spaces Tab** — Browse all available workspaces with type, capacity, amenities, and pricing
- **Book a Space Tab** — Select a space, pick date/time, enter your details and confirm
- **My Bookings Tab** — Enter your email to view your bookings and cancel if needed

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/spaces` | List all available spaces |
| POST | `/api/bookings` | Create a new booking (conflict check included) |
| GET | `/api/bookings?email=` | Get bookings by email |
| DELETE | `/api/bookings/:id` | Cancel a booking |

## 🏷️ Space Types
- 🖥️ **Hot Desk** — Open desks, hourly rate from $5/hr
- 🚪 **Private Booth** — Quiet focus booths, from $10/hr
- 🗓️ **Meeting Room** — Group rooms with AV equipment, from $18/hr
