# Hearing Clinic Admin Panel

A professional admin panel for managing a hearing clinic's contacts, appointments, and surgery slots. Built with Node.js, Express, React, and MongoDB.

## Features

- **Dashboard Overview**: Real-time statistics and quick actions
- **Contact Management**: View and manage patient inquiries
- **Appointment Management**: Handle patient appointments and bookings
- **Surgery Slot Management**: Book and manage doctor unavailability slots
- **Professional UI**: Clean blue and white theme with responsive design
- **Secure Authentication**: JWT-based admin authentication

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Custom CSS with professional styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://hearingclinicisb_db_user:Ej45C4XaJRO3W9dl@cluster0.p1hocil.mongodb.net/hearing-clinic?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Create Admin User

Run the admin user creation script:

```bash
node create-admin.js
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`
- Email: `admin@hearingclinic.pk`

### 4. Start the Application

#### Development Mode (Both servers)
```bash
npm run dev
```

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Contacts
- `GET /api/contacts` - Get all contacts
- `PUT /api/contacts/:id` - Update contact status

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Surgery Slots
- `GET /api/surgery-slots` - Get all surgery slots
- `POST /api/surgery-slots` - Create surgery slot
- `DELETE /api/surgery-slots/:id` - Delete surgery slot

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (default: 'admin'),
  createdAt: Date
}
```

### Contacts Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  message: String,
  status: String (new, contacted, resolved),
  createdAt: Date
}
```

### Appointments Collection
```javascript
{
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  appointmentDate: Date,
  appointmentTime: String,
  service: String,
  status: String (pending, confirmed, completed, cancelled),
  notes: String,
  createdAt: Date
}
```

### Surgery Slots Collection
```javascript
{
  title: String,
  startTime: Date,
  endTime: Date,
  description: String,
  createdBy: String,
  createdAt: Date
}
```

## Features Overview

### Dashboard
- Real-time statistics for contacts and appointments
- Quick action buttons for common tasks
- Professional card-based layout

### Contact Management
- View all patient inquiries
- Filter by status (new, contacted, resolved)
- Update contact status
- Responsive table design

### Booking Management
- **Patient Appointments**: View, confirm, complete, or cancel appointments
- **Surgery Slots**: Book doctor unavailability periods
- **Status Management**: Track appointment statuses
- **Time Management**: Prevent double-booking during surgery slots

### Surgery Slot System
- Book doctor unavailability periods
- Set custom time ranges
- Add descriptions for surgery details
- Automatically blocks patient appointments during surgery slots

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- CORS configuration
- Input validation

## Styling & UI

- Professional blue and white color scheme
- Responsive design for all screen sizes
- Clean typography and spacing
- Interactive hover effects
- Status badges with color coding
- Loading states and error handling

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

### Build for Production
```bash
npm run build
```

The built React app will be served from the `client/build` directory.

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

**Important**: Change these credentials in production!

## File Structure

```
hearing-clinic-admin/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── package.json
├── server.js              # Express server
├── create-admin.js        # Admin user creation script
├── package.json          # Backend dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.