import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { authAPI } from '../services/apiServices';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case ActionTypes.LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case ActionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case ActionTypes.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Load user on mount if token exists
  const { data: userData, isLoading } = useQuery(
    'currentUser',
    () => authAPI.getProfile(),
    {
      enabled: !!state.token,
      retry: false,
      onSuccess: (data) => {
        dispatch({
          type: ActionTypes.LOAD_USER,
          payload: data.data,
        });
      },
      onError: () => {
        dispatch({ type: ActionTypes.LOGIN_FAIL });
      },
    }
  );

  // Set loading based on query state
  useEffect(() => {
    if (!state.token) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    } else {
      dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
    }
  }, [isLoading, state.token]);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.LOGIN_START });
      
      const response = await authAPI.login(credentials);
      const { token, data: user } = response.data;

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { token, user },
      });

      // Invalidate and refetch user data
      queryClient.invalidateQueries('currentUser');
      
      toast.success('Welcome back!');
      return response.data;
    } catch (error) {
      dispatch({ type: ActionTypes.LOGIN_FAIL });
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.LOGIN_START });
      
      console.log('Registration attempt with data:', userData);
      
      const response = await authAPI.register(userData);
      const { token, data: user } = response.data;

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { token, user },
      });

      toast.success('Account created successfully!');
      return response.data;
    } catch (error) {
      dispatch({ type: ActionTypes.LOGIN_FAIL });
      console.error('Registration failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.message
      });
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: ActionTypes.LOGOUT });
      queryClient.clear();
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      
      dispatch({
        type: ActionTypes.UPDATE_USER,
        payload: response.data.data,
      });

      queryClient.invalidateQueries('currentUser');
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      throw error;
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      const response = await authAPI.updatePassword(passwordData);
      toast.success('Password updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      toast.error(message);
      throw error;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Request failed';
      toast.error(message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      toast.success('Password reset successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};