require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');
const connectDB  = require('./config/db');

// Route modules
const authRoutes      = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const userRoutes      = require('./routes/userRoutes');
const roleRoutes      = require('./routes/roleRoutes');
const masterRoutes    = require('./routes/masterRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded media files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => res.send('API is running successfully...'));

connectDB();

// ── Route mounting ────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/roles',      roleRoutes);
app.use('/api/master',     masterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
