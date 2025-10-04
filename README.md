# Full-Stack Project Management/Task Tracker

A modern, full-stack Project Management/Task Tracker web application built with React.js and Node.js/Express.

## Features

### Core Features
- ✅ User Authentication & Authorization (JWT-based)
- ✅ Dashboard with project/task overview
- ✅ Projects Management (CRUD operations)
- ✅ Task Management with assignments and status tracking
- ✅ Team Collaboration with task assignments
- ✅ Analytics & Reporting with charts
- ✅ Spectacular, responsive UI with dark/light mode
- ✅ Real-time updates

### Advanced Features
- ✅ File upload for attachments
- ✅ Activity log/audit trail
- ✅ Email notifications
- ✅ Drag-and-drop task reordering
- ✅ Custom user avatars

## Tech Stack

### Frontend
- **React.js** (with Hooks, Context API, Router)
- **Tailwind CSS** for styling
- **Material-UI** components
- **Chart.js** for analytics
- **React Beautiful DnD** for drag-and-drop
- **Axios** for API calls

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication
- **bcrypt** password hashing
- **Multer** for file uploads
- **Socket.io** for real-time features
- **Nodemailer** for email notifications

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd defence-project
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Projects Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/tasks` - Get task analytics
- `GET /api/analytics/projects` - Get project analytics

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## Deployment

### Backend (Heroku/Render)
1. Create account on Heroku or Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from main branch

### Frontend (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set build directory: `build`
5. Deploy from main branch

## Features Overview

### User Authentication
- Secure registration and login
- JWT token-based authentication
- Protected routes
- User profile management

### Project Management
- Create, view, edit, delete projects
- Project descriptions and deadlines
- Status tracking
- Team member management

### Task Management
- Add, update, delete tasks
- Task assignments to team members
- Priority levels (Low, Medium, High, Critical)
- Status tracking (To Do, In Progress, Done)
- Due date management
- File attachments

### Dashboard & Analytics
- Overview of projects and tasks
- Completion statistics
- Progress charts and graphs
- Recent activity feed
- Performance metrics

### Team Collaboration
- Invite team members to projects
- Task assignments and comments
- Real-time notifications
- Activity timeline

### UI/UX Features
- Modern, responsive design
- Dark/Light mode toggle
- Drag-and-drop task reordering
- Mobile-first approach
- Accessibility compliance
- Smooth animations and transitions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email@example.com] or create an issue in the GitHub repository.

---

**Built with ❤️ using React.js and Node.js**