# TaskManager - Project Management Application

## 🚀 Overview
A comprehensive full-stack project management and task tracking application built with React.js frontend and Node.js/Express backend. This application enables teams to efficiently manage projects, assign tasks, track progress, and collaborate in real-time.

## ✨ Features

### 🔐 **Authentication & Security**
- User registration with email verification
- Secure JWT-based authentication
- Password reset functionality
- Protected routes and middleware
- Role-based access control

### 📊 **Project Management**
- Create, edit, and delete projects
- Set project deadlines and descriptions
- Add team members and assign roles
- Project progress tracking
- Project analytics and insights

### ✅ **Task Management**
- Complete CRUD operations for tasks
- Task status tracking (To Do, In Progress, Review, Completed)
- Priority levels (Low, Medium, High)
- Due date management
- Task assignment to team members
- Subtask creation and management
- Time tracking for tasks
- Task comments and discussions

### 📈 **Analytics & Reporting**
- Dashboard with project overview
- Task completion statistics
- Team performance metrics
- Activity logs and audit trails
- Progress visualization

### 💼 **User Management**
- User profiles with avatar support
- Account settings and preferences
- Dark/Light theme switching
- Notification preferences

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Component library for consistent UI
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **React Hot Toast** - User notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **multer** - File upload handling
- **nodemon** - Development server auto-restart

### Security & Middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Input validation
- **Morgan** - HTTP request logging

## 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git
- Modern web browser

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/pauljustinchristopher/Task-management.git
cd "defence project"
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Setup

#### Backend Environment (.env in server directory)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

#### Frontend Environment (.env in client directory)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎮 Running the Application

### Development Mode

#### Option 1: Manual Start
```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Server
cd client
npm start
```

#### Option 2: VS Code Tasks
- Press `Ctrl+Shift+P`
- Type "Tasks: Run Task"
- Select "Start Backend Server" or "Start Development Server"

### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start backend in production
cd ../server
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🏗️ Project Structure
```
defence project/
├── client/                     # React frontend application
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Auth/          # Authentication components
│   │   │   └── Layout/        # Layout components
│   │   ├── contexts/          # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── styles/            # CSS and styling
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── .env
├── server/                     # Node.js backend application
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Express middleware
│   ├── models/                # MongoDB/Mongoose models
│   ├── routes/                # API routes
│   ├── uploads/               # File upload directory
│   ├── utils/                 # Backend utilities
│   ├── package.json
│   └── .env
├── .github/
│   └── copilot-instructions.md
├── README.md
├── API_DOCUMENTATION.md
└── .gitignore
```

## 🎯 Quick Start Guide

### 1. First Time Setup
1. **Install Prerequisites**: Ensure Node.js and MongoDB are installed
2. **Clone Repository**: Use the git clone command above
3. **Install Dependencies**: Run npm install in both client and server directories
4. **Setup Environment**: Create .env files with required variables
5. **Start MongoDB**: Ensure MongoDB service is running
6. **Run Application**: Start both backend and frontend servers

### 2. User Registration & Login
1. Navigate to http://localhost:3000
2. Click "Create Account" or "Sign Up"
3. Fill in your details with a strong password (must contain uppercase, lowercase, and numbers)
   - **Example**: Password123 ✅
   - **Invalid**: password123 ❌
4. After successful registration, you'll be automatically logged in
5. Access the dashboard to start managing projects and tasks

### 3. Project Management
1. **Create Project**: Click "New Project" from the Projects page
2. **Add Details**: Set name, description, and deadline
3. **Invite Team**: Add team members by email
4. **Manage Tasks**: Create tasks within your projects

### 4. Task Management
1. **Create Tasks**: Add tasks with titles, descriptions, and priorities
2. **Assign Tasks**: Assign to team members
3. **Track Progress**: Update task status as work progresses
4. **Time Tracking**: Start/stop time tracking for accurate reporting

## 📚 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics

*For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*

## 🔧 Development

### Available Scripts

#### Frontend (client/)
- `npm start` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

#### Backend (server/)
- `npm run dev` - Start with nodemon (development mode)
- `npm start` - Start production server
- `npm test` - Run backend tests

### Development Tools
- **Nodemon** - Auto-restart server on file changes
- **ESLint** - Code linting for consistent style
- **Prettier** - Code formatting
- **VS Code Tasks** - Integrated development workflow

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy the build/ folder to your hosting platform
```

### Backend Deployment (Heroku/Railway/DigitalOcean)
```bash
cd server
# Set environment variables on your hosting platform
# Deploy server directory
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=your-frontend-domain
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Server error while fetching user data"
- **Cause**: Backend not running or database connection issues
- **Solution**: Start backend server and ensure MongoDB is running

#### 2. "Routes not found" errors
- **Cause**: API endpoints mismatch between frontend and backend
- **Solution**: Check API base URL in client .env file

#### 3. Login/Registration not working
- **Cause**: Password validation or JWT configuration
- **Solution**: Ensure password meets requirements (uppercase, lowercase, numbers)

#### 4. Database connection failed
- **Cause**: MongoDB not running or incorrect connection string
- **Solution**: Start MongoDB service and check MONGODB_URI

### Health Checks
- **Backend Health**: http://localhost:5000/api/health
- **Database Test**: http://localhost:5000/api/test-db
- **Routes Status**: http://localhost:5000/api/routes-status

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

### Test Coverage
- Unit tests for components
- Integration tests for API endpoints
- Authentication flow testing
- Database operation testing

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style Guidelines
- Use ESLint and Prettier for consistent formatting
- Follow React best practices and hooks patterns
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author
**Paul Justin Christopher**
- GitHub: [@pauljustinchristopher](https://github.com/pauljustinchristopher)
- Email: pauljustinchristopher@gmail.com
- LinkedIn: [Paul Justin Christopher](https://linkedin.com/in/pauljustinchristopher)

## 🙏 Acknowledgments
- **Material-UI** for the comprehensive component library
- **MongoDB** for the flexible NoSQL database
- **Express.js** for the robust web framework
- **React.js** for the powerful frontend library
- **JWT** for secure authentication
- **Nodemon** for efficient development workflow

## 📊 Project Status
- ✅ **Backend API**: 100% Complete
- ✅ **Frontend Application**: 100% Complete
- ✅ **Authentication System**: 100% Complete
- ✅ **Database Models**: 100% Complete
- ✅ **Documentation**: 100% Complete
- ✅ **Git Integration**: 100% Complete

**Overall Progress: 100% COMPLETE** 🎉

## 🔮 Future Enhancements
- Real-time notifications with Socket.io
- Advanced analytics with charts and graphs
- Mobile application (React Native)
- File attachment support for tasks
- Email notifications for task assignments
- Calendar integration
- Gantt chart view for project timelines
- API rate limiting and caching
- Automated testing pipeline
- Docker containerization

---

**Made with ❤️ for SIWES Defence Project**