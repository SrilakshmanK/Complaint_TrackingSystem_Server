# CampusDesk — Backend API Server

A REST API server powering the **CampusDesk College Complaint Management System**. Built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB Atlas
- **Authentication** — JSON Web Tokens (JWT)
- **File Uploads** — Multer
- **Password Hashing** — bcrypt
- **Environment Config** — dotenv

---

## Project Structure

```
server/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Login, profile
│   ├── complaintController.js
│   ├── userController.js
│   ├── roleController.js
│   └── masterController.js # Dept, Programme, Block, Room
├── middleware/
│   └── auth.js             # JWT token verification
├── models/
│   ├── User.js
│   ├── Complaint.js
│   ├── Role.js
│   ├── Block.js
│   ├── RoomNo.js
│   ├── Department.js
│   └── Programme.js
├── routes/
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   ├── userRoutes.js
│   ├── roleRoutes.js
│   └── masterRoutes.js
├── uploads/                # Uploaded complaint media
├── public/
│   └── index.html          # API status page
├── server.js               # Entry point
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

```bash
# Clone the repository
git clone https://github.com/SrilakshmankK/Complaint_TrackingSystem_Server.git

# Navigate into the folder
cd Complaint_TrackingSystem_Server

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run the server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login with gmail and password |
| GET | `/api/profile` | Get logged in user profile |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/CreateUser` | Create a new user (Admin only) |
| GET | `/api/GetUser` | Get all users with populated role |
| DELETE | `/api/DeleteUser/:id` | Delete a user |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/CreateComplaint` | Submit a new complaint (multipart/form-data) |
| GET | `/api/GetComplaint` | Get all complaints |
| PUT | `/api/UpdateComplaint/:id` | Update complaint status (Staff) |
| PUT | `/api/AssignComplaint/:id` | Assign complaint to staff (Admin) |
| GET | `/api/GetComplaintReport` | Generate filtered report (Admin) |

### Master Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/GET | `/api/CreateDepartment` / `/api/GetDepartment` | Manage departments |
| POST/GET | `/api/CreateProgramme` / `/api/GetProgramme` | Manage programmes |
| POST/GET | `/api/CreateBlock` / `/api/GetBlock` | Manage blocks |
| POST/GET | `/api/CreateRoomNo` / `/api/GetRoomNo` | Manage room numbers |
| POST/GET | `/api/CreateRole` / `/api/GetRole` | Manage roles |

---

## User Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access — create users, assign complaints, view reports, manage all master data |
| **Staff** (Plumber, Tech, etc.) | View assigned complaints, update status |
| **Student / User** | Submit complaints, track own complaint status |

---

## Complaint Status Flow

```
Assign → Assigned → In-Progress → OnHold → Completed
```

---

## Deployment

This server is deployed on **Render**.

Live API: [https://c-t-s-server.onrender.com](https://c-t-s-server.onrender.com)

---

## Related Repository

- **Frontend (React Web App)** — [Complaint_TrackingSystem_Client](https://github.com/SrilakshmankK/Complaint_TrackingSystem_Client)

---

## License

This project is for educational purposes.
