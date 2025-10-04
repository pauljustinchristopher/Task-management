# TaskManager API Documentation

## 📝 Overview
This document provides comprehensive documentation for the TaskManager API. The API is built with Node.js and Express.js, providing RESTful endpoints for project and task management.

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 📊 Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors array
}
```

## 🚫 HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input/validation error)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Access denied)
- `404` - Not Found (Resource not found)
- `422` - Unprocessable Entity (Validation failed)
- `500` - Internal Server Error

## 🔑 Authentication Endpoints

### Register User
Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters, must contain uppercase, lowercase, and number

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "isActive": true,
    "createdAt": "2023-09-04T10:30:00.000Z"
  }
}
```

### Login User
Authenticate user and receive JWT token.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "lastLogin": "2023-09-04T10:35:00.000Z"
  }
}
```

### Get Current User Profile
Retrieve authenticated user's profile information.

```http
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "isActive": true,
    "projects": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9d1",
        "title": "Project Alpha",
        "status": "active"
      }
    ],
    "createdAt": "2023-09-04T10:30:00.000Z",
    "updatedAt": "2023-09-04T10:35:00.000Z"
  }
}
```

### Update User Profile
Update authenticated user's profile information.

```http
PUT /api/auth/profile
```

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Full-stack developer",
  "location": "New York, USA",
  "website": "https://johnsmith.dev"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d0",
    "name": "John Smith",
    "email": "john@example.com",
    "bio": "Full-stack developer",
    "location": "New York, USA",
    "website": "https://johnsmith.dev"
  },
  "message": "Profile updated successfully"
}
```

### Update Password
Change user's password.

```http
PUT /api/auth/password
```

**Request Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### Logout User
Invalidate user session (client-side token removal).

```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token
Get a new JWT token using existing valid token.

```http
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <current_token>
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📂 Project Endpoints

### Get All Projects
Retrieve all projects for authenticated user.

```http
GET /api/projects
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sort` (optional): Sort field and order (e.g., `-createdAt`, `title`)
- `status` (optional): Filter by status (`active`, `completed`, `on-hold`)

**Example:**
```
GET /api/projects?page=1&limit=10&sort=-createdAt&status=active
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64f5a8b2c9d4e5f6a7b8c9d1",
      "title": "Project Alpha",
      "description": "Main project for Q4",
      "status": "active",
      "priority": "high",
      "startDate": "2023-09-01T00:00:00.000Z",
      "endDate": "2023-12-31T23:59:59.000Z",
      "owner": {
        "id": "64f5a8b2c9d4e5f6a7b8c9d0",
        "name": "John Doe"
      },
      "members": [
        {
          "user": "64f5a8b2c9d4e5f6a7b8c9d2",
          "name": "Jane Smith",
          "role": "developer"
        }
      ],
      "tasksCount": 15,
      "completedTasks": 8,
      "progress": 53.33,
      "createdAt": "2023-09-01T10:00:00.000Z",
      "updatedAt": "2023-09-04T15:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Project by ID
Retrieve detailed information about a specific project.

```http
GET /api/projects/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d1",
    "title": "Project Alpha",
    "description": "Main project for Q4 development",
    "status": "active",
    "priority": "high",
    "startDate": "2023-09-01T00:00:00.000Z",
    "endDate": "2023-12-31T23:59:59.000Z",
    "owner": {
      "id": "64f5a8b2c9d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "user": "64f5a8b2c9d4e5f6a7b8c9d2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "developer",
        "joinedAt": "2023-09-02T00:00:00.000Z"
      }
    ],
    "tasks": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9d3",
        "title": "Setup Database",
        "status": "completed",
        "priority": "high",
        "dueDate": "2023-09-15T00:00:00.000Z"
      }
    ],
    "statistics": {
      "totalTasks": 15,
      "completedTasks": 8,
      "inProgressTasks": 5,
      "todoTasks": 2,
      "progress": 53.33
    },
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-04T15:30:00.000Z"
  }
}
```

### Create New Project
Create a new project.

```http
POST /api/projects
```

**Request Body:**
```json
{
  "title": "Project Beta",
  "description": "New client project for mobile app",
  "status": "active",
  "priority": "medium",
  "startDate": "2023-10-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "members": [
    {
      "user": "64f5a8b2c9d4e5f6a7b8c9d2",
      "role": "developer"
    }
  ]
}
```

**Validation Rules:**
- `title`: Required, 3-100 characters
- `description`: Optional, max 1000 characters
- `status`: Optional, enum: [`active`, `completed`, `on-hold`]
- `priority`: Optional, enum: [`low`, `medium`, `high`]
- `startDate`: Optional, valid date
- `endDate`: Optional, valid date, must be after startDate

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d4",
    "title": "Project Beta",
    "description": "New client project for mobile app",
    "status": "active",
    "priority": "medium",
    "startDate": "2023-10-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z",
    "owner": "64f5a8b2c9d4e5f6a7b8c9d0",
    "members": [],
    "createdAt": "2023-09-04T16:00:00.000Z"
  },
  "message": "Project created successfully"
}
```

### Update Project
Update existing project information.

```http
PUT /api/projects/:id
```

**Request Body:**
```json
{
  "title": "Project Beta - Mobile App",
  "description": "Updated description for mobile app project",
  "status": "active",
  "priority": "high",
  "endDate": "2024-02-29T23:59:59.000Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d4",
    "title": "Project Beta - Mobile App",
    "description": "Updated description for mobile app project",
    "status": "active",
    "priority": "high",
    "endDate": "2024-02-29T23:59:59.000Z",
    "updatedAt": "2023-09-04T16:30:00.000Z"
  },
  "message": "Project updated successfully"
}
```

### Delete Project
Delete a project and all associated tasks.

```http
DELETE /api/projects/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Add Project Member
Add a member to a project.

```http
POST /api/projects/:id/members
```

**Request Body:**
```json
{
  "userId": "64f5a8b2c9d4e5f6a7b8c9d5",
  "role": "developer"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member added successfully"
}
```

### Remove Project Member
Remove a member from a project.

```http
DELETE /api/projects/:id/members/:userId
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

## ✅ Task Endpoints

### Get All Tasks
Retrieve all tasks for authenticated user.

```http
GET /api/tasks
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page
- `sort` (optional): Sort field and order
- `status` (optional): Filter by status (`todo`, `in-progress`, `review`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `project` (optional): Filter by project ID
- `assignedTo` (optional): Filter by assigned user ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64f5a8b2c9d4e5f6a7b8c9d3",
      "title": "Setup Database Schema",
      "description": "Create MongoDB schema for user and project models",
      "status": "completed",
      "priority": "high",
      "project": {
        "id": "64f5a8b2c9d4e5f6a7b8c9d1",
        "title": "Project Alpha"
      },
      "assignedTo": {
        "id": "64f5a8b2c9d4e5f6a7b8c9d0",
        "name": "John Doe"
      },
      "creator": {
        "id": "64f5a8b2c9d4e5f6a7b8c9d0",
        "name": "John Doe"
      },
      "dueDate": "2023-09-15T23:59:59.000Z",
      "completedAt": "2023-09-10T14:30:00.000Z",
      "estimatedHours": 8,
      "actualHours": 6,
      "tags": ["backend", "database"],
      "createdAt": "2023-09-05T09:00:00.000Z",
      "updatedAt": "2023-09-10T14:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 42
  }
}
```

### Get Task by ID
Retrieve detailed information about a specific task.

```http
GET /api/tasks/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9d3",
    "title": "Setup Database Schema",
    "description": "Create MongoDB schema for user and project models with proper validation",
    "status": "completed",
    "priority": "high",
    "project": {
      "id": "64f5a8b2c9d4e5f6a7b8c9d1",
      "title": "Project Alpha",
      "status": "active"
    },
    "assignedTo": {
      "id": "64f5a8b2c9d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "creator": {
      "id": "64f5a8b2c9d4e5f6a7b8c9d0",
      "name": "John Doe"
    },
    "dueDate": "2023-09-15T23:59:59.000Z",
    "completedAt": "2023-09-10T14:30:00.000Z",
    "estimatedHours": 8,
    "actualHours": 6,
    "tags": ["backend", "database", "mongodb"],
    "subtasks": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9d6",
        "title": "Design User Schema",
        "completed": true,
        "completedAt": "2023-09-08T10:00:00.000Z"
      }
    ],
    "comments": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9d7",
        "content": "Schema looks good, ready for implementation",
        "author": {
          "id": "64f5a8b2c9d4e5f6a7b8c9d2",
          "name": "Jane Smith"
        },
        "createdAt": "2023-09-09T16:30:00.000Z"
      }
    ],
    "attachments": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9d8",
        "filename": "schema-design.pdf",
        "originalName": "Database Schema Design.pdf",
        "size": 1024000,
        "mimeType": "application/pdf",
        "uploadedAt": "2023-09-08T11:00:00.000Z"
      }
    ],
    "timeTracking": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9d9",
        "startTime": "2023-09-08T09:00:00.000Z",
        "endTime": "2023-09-08T12:00:00.000Z",
        "duration": 10800,
        "description": "Schema design and implementation"
      }
    ],
    "createdAt": "2023-09-05T09:00:00.000Z",
    "updatedAt": "2023-09-10T14:30:00.000Z"
  }
}
```

### Create New Task
Create a new task.

```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Implement User Authentication",
  "description": "Add JWT-based authentication with login/register endpoints",
  "status": "todo",
  "priority": "high",
  "project": "64f5a8b2c9d4e5f6a7b8c9d1",
  "assignedTo": "64f5a8b2c9d4e5f6a7b8c9d2",
  "dueDate": "2023-09-20T23:59:59.000Z",
  "estimatedHours": 12,
  "tags": ["backend", "authentication", "security"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9da",
    "title": "Implement User Authentication",
    "description": "Add JWT-based authentication with login/register endpoints",
    "status": "todo",
    "priority": "high",
    "project": "64f5a8b2c9d4e5f6a7b8c9d1",
    "assignedTo": "64f5a8b2c9d4e5f6a7b8c9d2",
    "creator": "64f5a8b2c9d4e5f6a7b8c9d0",
    "dueDate": "2023-09-20T23:59:59.000Z",
    "estimatedHours": 12,
    "actualHours": 0,
    "tags": ["backend", "authentication", "security"],
    "createdAt": "2023-09-05T10:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### Update Task
Update existing task information.

```http
PUT /api/tasks/:id
```

**Request Body:**
```json
{
  "title": "Implement User Authentication & Authorization",
  "status": "in-progress",
  "actualHours": 4,
  "tags": ["backend", "authentication", "security", "jwt"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9da",
    "title": "Implement User Authentication & Authorization",
    "status": "in-progress",
    "actualHours": 4,
    "tags": ["backend", "authentication", "security", "jwt"],
    "updatedAt": "2023-09-06T14:30:00.000Z"
  },
  "message": "Task updated successfully"
}
```

### Delete Task
Delete a task and all associated data.

```http
DELETE /api/tasks/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Add Task Comment
Add a comment to a task.

```http
POST /api/tasks/:id/comments
```

**Request Body:**
```json
{
  "content": "Authentication endpoints are working perfectly. Ready for testing."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9db",
    "content": "Authentication endpoints are working perfectly. Ready for testing.",
    "author": {
      "id": "64f5a8b2c9d4e5f6a7b8c9d0",
      "name": "John Doe"
    },
    "createdAt": "2023-09-06T15:00:00.000Z"
  },
  "message": "Comment added successfully"
}
```

### Start Time Tracking
Start tracking time for a task.

```http
POST /api/tasks/:id/time-tracking/start
```

**Request Body:**
```json
{
  "description": "Working on authentication implementation"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9dc",
    "startTime": "2023-09-06T16:00:00.000Z",
    "description": "Working on authentication implementation"
  },
  "message": "Time tracking started"
}
```

### Stop Time Tracking
Stop tracking time for a task.

```http
POST /api/tasks/:id/time-tracking/stop
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f5a8b2c9d4e5f6a7b8c9dc",
    "startTime": "2023-09-06T16:00:00.000Z",
    "endTime": "2023-09-06T18:30:00.000Z",
    "duration": 9000,
    "description": "Working on authentication implementation"
  },
  "message": "Time tracking stopped"
}
```

## 📊 Analytics Endpoints

### Get Dashboard Statistics
Retrieve dashboard analytics data.

```http
GET /api/analytics/dashboard
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProjects": 12,
      "activeProjects": 8,
      "completedProjects": 3,
      "onHoldProjects": 1,
      "totalTasks": 156,
      "completedTasks": 89,
      "inProgressTasks": 45,
      "todoTasks": 22,
      "overdueTasks": 5
    },
    "productivity": {
      "tasksCompletedThisWeek": 12,
      "tasksCompletedLastWeek": 8,
      "averageTaskCompletionTime": 4.5,
      "totalHoursTracked": 320,
      "averageHoursPerTask": 6.2
    },
    "projectProgress": [
      {
        "projectId": "64f5a8b2c9d4e5f6a7b8c9d1",
        "projectName": "Project Alpha",
        "progress": 75.5,
        "totalTasks": 20,
        "completedTasks": 15,
        "dueDate": "2023-12-31T23:59:59.000Z"
      }
    ],
    "recentActivity": [
      {
        "id": "64f5a8b2c9d4e5f6a7b8c9dd",
        "type": "task_completed",
        "description": "Task 'Setup Database Schema' was completed",
        "user": {
          "id": "64f5a8b2c9d4e5f6a7b8c9d0",
          "name": "John Doe"
        },
        "timestamp": "2023-09-06T14:30:00.000Z"
      }
    ],
    "upcomingDeadlines": [
      {
        "taskId": "64f5a8b2c9d4e5f6a7b8c9da",
        "taskTitle": "Implement User Authentication",
        "projectName": "Project Alpha",
        "dueDate": "2023-09-20T23:59:59.000Z",
        "daysUntilDue": 14,
        "isOverdue": false
      }
    ]
  }
}
```

### Get Task Analytics
Retrieve detailed task analytics.

```http
GET /api/analytics/tasks
```

**Query Parameters:**
- `timeframe` (optional): `week`, `month`, `quarter`, `year`
- `project` (optional): Filter by project ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "taskStatusDistribution": {
      "todo": 22,
      "in-progress": 45,
      "review": 12,
      "completed": 89
    },
    "taskPriorityDistribution": {
      "low": 34,
      "medium": 78,
      "high": 44
    },
    "completionTrend": [
      {
        "date": "2023-09-01",
        "completed": 5
      },
      {
        "date": "2023-09-02",
        "completed": 8
      }
    ],
    "averageCompletionTime": {
      "low": 2.5,
      "medium": 4.8,
      "high": 7.2
    }
  }
}
```

## 🏥 Health Check Endpoints

### API Health Check
Check if the API is running properly.

```http
GET /api/health
```

**Response (200):**
```json
{
  "success": true,
  "status": "Server is running",
  "database": {
    "status": "Connected",
    "host": "localhost",
    "name": "taskmanager",
    "port": 27017
  },
  "environment": "development",
  "timestamp": "2023-09-06T16:00:00.000Z"
}
```

### Database Test
Test database connectivity and operations.

```http
GET /api/test-db
```

**Response (200):**
```json
{
  "success": true,
  "message": "Database test successful",
  "result": "Read/Write operations working"
}
```

### Routes Status
Check which routes are loaded and available.

```http
GET /api/routes-status
```

**Response (200):**
```json
{
  "success": true,
  "routesLoaded": true,
  "availableRoutes": [
    "POST /api/auth/register",
    "POST /api/auth/login",
    "GET /api/auth/me",
    "GET /api/projects",
    "POST /api/projects",
    "GET /api/tasks"
  ]
}
```

## 📁 File Upload Endpoints

### Upload File
Upload files (images, documents) for tasks or projects.

```http
POST /api/upload
```

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Max file size: 10MB
- Allowed types: images (jpg, png, gif), documents (pdf, doc, docx)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filename": "1693996800000-document.pdf",
    "originalName": "Project Requirements.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "url": "/uploads/1693996800000-document.pdf"
  },
  "message": "File uploaded successfully"
}
```

## ⚠️ Error Handling

### Validation Errors
When validation fails, the API returns detailed error information:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "msg": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "path": "password",
      "location": "body",
      "value": "password123"
    }
  ]
}
```

### Authentication Errors
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Authorization Errors
```json
{
  "success": false,
  "message": "Access denied. You don't have permission to perform this action."
}
```

### Not Found Errors
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Errors
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (in development mode only)"
}
```

## 🔒 Rate Limiting
Authentication endpoints are rate-limited to prevent abuse:
- **Login/Register**: 5 requests per 15 minutes per IP
- **Password Reset**: 3 requests per hour per IP
- **General API**: 100 requests per 15 minutes per user

## 📚 API Versioning
Current API version: `v1`

Future versions will be accessible via:
```
/api/v2/...
```

## 🧪 Testing the API

### Using cURL
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'

# Get projects (with token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the provided Postman collection
2. Set environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: Your JWT token
3. Run the authentication requests first to get a token
4. Use the token for protected endpoints

---

**API Documentation v1.0 - Last updated: October 4, 2025**
**Made with ❤️ for TaskManager Application**