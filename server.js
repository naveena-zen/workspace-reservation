const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

mongoose.connect('mongodb://127.0.0.1:27017/workspace_booking', {
  serverSelectionTimeoutMS: 5000
}).then(() => console.log('MongoDB connected')).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Models
const spaceSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['hot-desk', 'meeting-room', 'private-booth'] },
  capacity: Number,
  amenities: [String],
  pricePerHour: Number
});

const bookingSchema = new mongoose.Schema({
  spaceId: mongoose.Schema.Types.ObjectId,
  spaceName: String,
  userName: String,
  userEmail: String,
  date: String,
  startTime: String,
  endTime: String,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
});

const Space = mongoose.model('Space', spaceSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Seed data
const seedSpaces = [
  { name: 'Open Desk A', type: 'hot-desk', capacity: 1, amenities: ['WiFi', 'Power Outlet'], pricePerHour: 5 },
  { name: 'Open Desk B', type: 'hot-desk', capacity: 1, amenities: ['WiFi', 'Monitor'], pricePerHour: 7 },
  { name: 'Focus Booth 1', type: 'private-booth', capacity: 1, amenities: ['WiFi', 'Soundproof', 'Power Outlet'], pricePerHour: 10 },
  { name: 'Focus Booth 2', type: 'private-booth', capacity: 2, amenities: ['WiFi', 'Whiteboard', 'Power Outlet'], pricePerHour: 12 },
  { name: 'Boardroom', type: 'meeting-room', capacity: 10, amenities: ['WiFi', 'Projector', 'Whiteboard', 'TV Screen'], pricePerHour: 25 },
  { name: 'Team Room', type: 'meeting-room', capacity: 6, amenities: ['WiFi', 'TV Screen', 'Whiteboard'], pricePerHour: 18 }
];

async function seedDB() {
  try {
    const count = await Space.countDocuments();
    if (count === 0) {
      await Space.insertMany(seedSpaces);
      console.log('Seeded 6 spaces');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}
mongoose.connection.once('open', seedDB);

// Routes
app.get('/api/spaces', async (req, res) => {
  const spaces = await Space.find();
  res.json(spaces);
});

app.post('/api/bookings', async (req, res) => {
  const { spaceId, spaceName, userName, userEmail, date, startTime, endTime } = req.body;

  // Check conflict
  const conflict = await Booking.findOne({
    spaceId, date, status: 'confirmed',
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  });

  if (conflict) return res.status(409).json({ error: 'Time slot already booked for this space.' });

  const booking = await Booking.create({ spaceId, spaceName, userName, userEmail, date, startTime, endTime });
  res.status(201).json(booking);
});

app.get('/api/bookings', async (req, res) => {
  const { email } = req.query;
  const filter = email ? { userEmail: email } : {};
  const bookings = await Booking.find(filter).sort({ date: 1, startTime: 1 });
  res.json(bookings);
});

app.delete('/api/bookings/:id', async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
  res.json({ message: 'Booking cancelled' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
