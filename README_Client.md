# CampusDesk — React Web Client

The frontend web application for the **CampusDesk College Complaint Management System**. Built with React, Vite, and Tailwind CSS.

---

## Tech Stack

- **Framework** — React 18
- **Build Tool** — Vite
- **Styling** — Tailwind CSS
- **Routing** — React Router v6
- **HTTP Client** — Axios
- **State Management** — React Context API

---

## Project Structure

```
web_client/
├── public/                  # Static assets and favicon
├── src/
│   ├── api/
│   │   ├── axios.js         # Axios instance with auth interceptor
│   │   └── index.js         # All named API functions
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state, login, logout
│   ├── components/
│   │   ├── Navbar.jsx       # Role-based navigation bar
│   │   ├── ProtectedRoute.jsx
│   │   └── StatusBadge.jsx  # Complaint status pill
│   ├── pages/
│   │   ├── Landing.jsx      # Public landing page
│   │   ├── Login.jsx        # Split-panel login page
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Complaints.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── MasterData.jsx
│   │   │   └── Report.jsx
│   │   ├── staff/
│   │   │   └── StaffDashboard.jsx
│   │   └── student/
│   │       ├── NewComplaint.jsx
│   │       └── MyComplaints.jsx
│   ├── App.jsx              # Routes with role-based guards
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js           # Dev proxy to backend
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running (see server repo)

### Installation

```bash
# Clone the repository
git clone https://github.com/SrilakshmankK/Complaint_TrackingSystem_Client.git

# Navigate into the folder
cd Complaint_TrackingSystem_Client

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://c-t-s-server.onrender.com
```

### Run the app

```bash
# Development
npm run dev

# Build for production
npm run build
```

App runs on `http://localhost:5173`

---

## Features by Role

### Super Admin
- Dashboard with complaint statistics
- View, filter, and assign complaints to specific staff members
- Two-level assignment — select role then select specific staff person
- Create, view, and delete users
- Manage master data — Departments, Programmes, Blocks, Rooms, Roles
- Generate filtered complaint reports

### Staff
- View complaints assigned specifically to them
- Update complaint status — In Progress, On Hold, Completed

### Student / User
- Submit new complaints with block, room, type, description, and optional photo
- Track status of their own submitted complaints

---

## Role-Based Routing

| Role | Default Route |
|------|--------------|
| Super Admin | `/admin/dashboard` |
| Staff | `/staff/complaints` |
| Student / User | `/student/complaints` |

Unauthenticated users are redirected to `/login`. Wrong-role access shows a 403 page.

---

## Complaint Status Flow

```
New → Assigned → In Progress → On Hold → Completed
```

---

## Deployment

This client is deployed on **Vercel / Netlify**.

Live App: [https://complaint-tracking-system-client.vercel.app](https://complaint-tracking-system-client.vercel.app)

---

## Related Repository

- **Backend (Node.js + Express API)** — [Complaint_TrackingSystem_Server](https://github.com/SrilakshmankK/Complaint_TrackingSystem_Server)

---

## License

This project is for educational purposes.
