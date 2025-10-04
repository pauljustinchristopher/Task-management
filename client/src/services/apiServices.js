import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    console.error('API Error:', {
      status: response?.status,
      data: response?.data,
      message: response?.data?.message || error.message,
      errors: response?.data?.errors
    });
    
    if (response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const message = response?.data?.message || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Login
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Register
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Logout
  logout: () => {
    return api.post('/auth/logout');
  },

  // Refresh token
  refreshToken: () => {
    return api.post('/auth/refresh');
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password });
  },

  // Verify reset token
  verifyResetToken: (token) => {
    return api.get(`/auth/verify-reset-token/${token}`);
  },

  // Get profile
  getProfile: () => {
    return api.get('/auth/profile');
  },

  // Update profile
  updateProfile: (data) => {
    return api.put('/auth/profile', data);
  },

  // Update password
  updatePassword: (passwordData) => {
    return api.put('/auth/password', passwordData);
  },

  // Delete account
  deleteAccount: () => {
    return api.delete('/auth/account');
  },
};

// Project API calls
export const projectAPI = {
  // Get all projects
  getProjects: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/projects?${queryString}`);
  },

  // Get single project
  getProject: (id) => {
    return api.get(`/projects/${id}`);
  },

  // Create new project
  createProject: (projectData) => {
    return api.post('/projects', projectData);
  },

  // Update project
  updateProject: (id, projectData) => {
    return api.put(`/projects/${id}`, projectData);
  },

  // Delete project
  deleteProject: (id) => {
    return api.delete(`/projects/${id}`);
  },

  // Get project members
  getProjectMembers: (id) => {
    return api.get(`/projects/${id}/members`);
  },

  // Add member to project
  addMember: (id, memberData) => {
    return api.post(`/projects/${id}/members`, memberData);
  },

  // Remove member from project
  removeMember: (id, userId) => {
    return api.delete(`/projects/${id}/members/${userId}`);
  },

  // Update member role
  updateMemberRole: (id, userId, roleData) => {
    return api.put(`/projects/${id}/members/${userId}`, roleData);
  },

  // Get project activities
  getProjectActivities: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/projects/${id}/activities?${queryString}`);
  },

  // Archive project
  archiveProject: (id) => {
    return api.put(`/projects/${id}/archive`);
  },

  // Restore project
  restoreProject: (id) => {
    return api.put(`/projects/${id}/restore`);
  },
};

// Task API calls
export const taskAPI = {
  // Get all tasks
  getTasks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/tasks?${queryString}`);
  },

  // Get single task
  getTask: (id) => {
    return api.get(`/tasks/${id}`);
  },

  // Create new task
  createTask: (taskData) => {
    return api.post('/tasks', taskData);
  },

  // Update task
  updateTask: (id, taskData) => {
    return api.put(`/tasks/${id}`, taskData);
  },

  // Delete task
  deleteTask: (id) => {
    return api.delete(`/tasks/${id}`);
  },

  // Add comment to task
  addComment: (id, commentData) => {
    return api.post(`/tasks/${id}/comments`, commentData);
  },

  // Update comment
  updateComment: (taskId, commentId, commentData) => {
    return api.put(`/tasks/${taskId}/comments/${commentId}`, commentData);
  },

  // Delete comment
  deleteComment: (taskId, commentId) => {
    return api.delete(`/tasks/${taskId}/comments/${commentId}`);
  },

  // Add subtask
  addSubtask: (id, subtaskData) => {
    return api.post(`/tasks/${id}/subtasks`, subtaskData);
  },

  // Toggle subtask completion
  toggleSubtask: (taskId, subtaskId) => {
    return api.put(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
  },

  // Start time tracking
  startTimeTracking: (id, description) => {
    return api.post(`/tasks/${id}/time-tracking/start`, { description });
  },

  // Stop time tracking
  stopTimeTracking: (id) => {
    return api.post(`/tasks/${id}/time-tracking/stop`);
  },

  // Update task positions (for drag and drop)
  updateTaskPositions: (positions) => {
    return api.put('/tasks/positions', { positions });
  },
};

// Analytics API calls
export const analyticsAPI = {
  // Get dashboard analytics
  getDashboardAnalytics: () => {
    return api.get('/analytics/dashboard');
  },

  // Get task analytics
  getTaskAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/analytics/tasks?${queryString}`);
  },

  // Get project analytics
  getProjectAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/analytics/projects?${queryString}`);
  },

  // Get user productivity analytics
  getUserProductivity: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/analytics/productivity?${queryString}`);
  },

  // Get time tracking analytics
  getTimeTracking: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/analytics/time-tracking?${queryString}`);
  },
};

// Upload API calls
export const uploadAPI = {
  // Upload file
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple files
  uploadFiles: (files, type = 'general') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('type', type);
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete file
  deleteFile: (fileId) => {
    return api.delete(`/upload/${fileId}`);
  },
};

// User API calls
export const userAPI = {
  // Get all users (for mentions, assignments, etc.)
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/users?${queryString}`);
  },

  // Get user by ID
  getUser: (id) => {
    return api.get(`/users/${id}`);
  },

  // Search users
  searchUsers: (query) => {
    return api.get(`/users/search?q=${encodeURIComponent(query)}`);
  },

  // Get user activities
  getUserActivities: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/users/${id}/activities?${queryString}`);
  },
};

// Search API calls
export const searchAPI = {
  // Global search
  globalSearch: (query) => {
    return api.get('/search', { params: { q: query } });
  },

  // Search projects
  searchProjects: (query) => {
    return api.get('/search/projects', { params: { q: query } });
  },

  // Search tasks
  searchTasks: (query) => {
    return api.get('/search/tasks', { params: { q: query } });
  },

  // Search users
  searchUsers: (query) => {
    return api.get('/search/users', { params: { q: query } });
  },
};

// Notifications API calls
export const notificationAPI = {
  // Get notifications
  getNotifications: () => {
    return api.get('/notifications');
  },

  // Mark notification as read
  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return api.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },
};

// Export all APIs
export default {
  projects: projectAPI,
  tasks: taskAPI,
  analytics: analyticsAPI,
  upload: uploadAPI,
  users: userAPI,
};