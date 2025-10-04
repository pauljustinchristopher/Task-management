import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

// Create context
const SocketContext = createContext();

// Provider component
export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      socket.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
        transports: ['websocket'],
      });

      // Join user's personal room
      socket.current.emit('join-user', user._id);

      // Connection event handlers
      socket.current.on('connect', () => {
        console.log('Connected to server');
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Real-time event handlers
      socket.current.on('task-updated', (data) => {
        toast.success(`Task "${data.task.title}" was updated by ${data.updatedBy}`);
      });

      socket.current.on('project-updated', (data) => {
        toast.success(`Project "${data.project.title}" was updated by ${data.updatedBy}`);
      });

      socket.current.on('task-assigned', (data) => {
        if (data.assignedTo === user._id) {
          toast.success(`You were assigned to task "${data.task.title}"`);
        }
      });

      socket.current.on('new-comment', (data) => {
        if (data.task.assignedTo === user._id || data.project.owner === user._id) {
          toast.info(`New comment on "${data.task.title}" by ${data.user.name}`);
        }
      });

      socket.current.on('member-added', (data) => {
        if (data.member._id === user._id) {
          toast.success(`You were added to project "${data.project.title}"`);
        } else {
          toast.info(`${data.member.name} joined the project`);
        }
      });

      socket.current.on('member-removed', (data) => {
        if (data.userId === user._id) {
          toast.warning('You were removed from a project');
        }
      });

      socket.current.on('notification', (data) => {
        toast(data.message, {
          icon: data.type === 'success' ? '✅' : data.type === 'warning' ? '⚠️' : 'ℹ️',
        });
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [isAuthenticated, user]);

  // Socket utility functions
  const joinProjectRoom = (projectId) => {
    if (socket.current) {
      socket.current.emit('join-project', projectId);
    }
  };

  const leaveProjectRoom = (projectId) => {
    if (socket.current) {
      socket.current.emit('leave-project', projectId);
    }
  };

  const emitTaskUpdate = (taskData) => {
    if (socket.current) {
      socket.current.emit('task-updated', taskData);
    }
  };

  const emitProjectUpdate = (projectData) => {
    if (socket.current) {
      socket.current.emit('project-updated', projectData);
    }
  };

  const emitNewComment = (commentData) => {
    if (socket.current) {
      socket.current.emit('new-comment', commentData);
    }
  };

  const on = (event, callback) => {
    if (socket.current) {
      socket.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socket.current) {
      socket.current.off(event, callback);
    }
  };

  const emit = (event, data) => {
    if (socket.current) {
      socket.current.emit(event, data);
    }
  };

  const value = {
    socket: socket.current,
    joinProjectRoom,
    leaveProjectRoom,
    emitTaskUpdate,
    emitProjectUpdate,
    emitNewComment,
    on,
    off,
    emit,
    isConnected: socket.current?.connected || false,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};