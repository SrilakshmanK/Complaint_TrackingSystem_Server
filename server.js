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




app.use(express.static(path.join(__dirname,'../public')))
 
// Serving the html file from the /public directory 
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'))
})



// Serve uploaded media files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));

connectDB();

// ── Route mounting ────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/roles',      roleRoutes);
app.use('/api/master',     masterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
