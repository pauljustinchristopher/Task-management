// Mock API service for frontend-only deployment
// This will be replaced when backend is deployed

const mockUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  bio: 'This is a demo account for testing purposes',
  location: 'Demo Location',
  website: 'https://demo.com'
};

const mockProjects = [
  {
    id: '1',
    title: 'Demo Project',
    description: 'This is a demo project to showcase the application',
    status: 'active',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    members: [mockUser]
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Demo Task',
    description: 'This is a demo task',
    status: 'todo',
    priority: 'medium',
    projectId: '1',
    assignedTo: mockUser,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  // Auth API
  login: async (credentials) => {
    await delay(1000);
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      return {
        data: {
          token: 'mock-jwt-token',
          user: mockUser
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(1000);
    return {
      data: {
        token: 'mock-jwt-token',
        user: { ...mockUser, ...userData, id: '2' }
      }
    };
  },

  getProfile: async () => {
    await delay(500);
    return { data: { data: mockUser } };
  },

  updateProfile: async (data) => {
    await delay(500);
    return { data: { data: { ...mockUser, ...data } } };
  },

  // Projects API
  getProjects: async () => {
    await delay(500);
    return { data: { data: mockProjects } };
  },

  getProject: async (id) => {
    await delay(500);
    return { data: { data: mockProjects.find(p => p.id === id) } };
  },

  createProject: async (projectData) => {
    await delay(500);
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      members: [mockUser]
    };
    return { data: { data: newProject } };
  },

  // Tasks API
  getTasks: async () => {
    await delay(500);
    return { data: { data: mockTasks } };
  },

  createTask: async (taskData) => {
    await delay(500);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      assignedTo: mockUser
    };
    return { data: { data: newTask } };
  },

  // Analytics API
  getAnalytics: async () => {
    await delay(500);
    return {
      data: {
        data: {
          totalProjects: 1,
          totalTasks: 1,
          completedTasks: 0,
          pendingTasks: 1
        }
      }
    };
  }
};