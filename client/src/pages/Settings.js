import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    projectUpdates: true
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleNotificationChange = (setting) => (event) => {
    setNotifications({
      ...notifications,
      [setting]: event.target.checked
    });
    toast.success('Notification settings updated');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    
    // Here you would typically call an API to delete the account
    toast.success('Account deletion request submitted');
    setOpenDeleteDialog(false);
    logout();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {/* Appearance Settings */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <PaletteIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Appearance</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <FormControlLabel
          control={
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              color="primary"
            />
          }
          label="Dark Mode"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
          Toggle between light and dark theme
        </Typography>
      </Paper>

      {/* Notification Settings */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.email}
                  onChange={handleNotificationChange('email')}
                  color="primary"
                />
              }
              label="Email Notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive notifications via email
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.push}
                  onChange={handleNotificationChange('push')}
                  color="primary"
                />
              }
              label="Push Notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive browser push notifications
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.taskReminders}
                  onChange={handleNotificationChange('taskReminders')}
                  color="primary"
                />
              }
              label="Task Reminders"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Get reminded about upcoming deadlines
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.projectUpdates}
                  onChange={handleNotificationChange('projectUpdates')}
                  color="primary"
                />
              }
              label="Project Updates"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Notifications about project changes
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Privacy & Security */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <SecurityIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Privacy & Security</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Your account is secured with industry-standard encryption and security measures.
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          Two-Factor Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Add an extra layer of security to your account by enabling two-factor authentication.
        </Typography>
        <Button variant="outlined" size="small">
          Enable 2FA
        </Button>
      </Paper>

      {/* Data Management */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <DownloadIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Export Data</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Download a copy of all your data including projects, tasks, and activity logs.
                </Typography>
                <Button variant="outlined" onClick={handleExportData}>
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="h6" color="error">
                    Delete Account
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Account Information */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Account Created
            </Typography>
            <Typography variant="body1">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Last Login
            </Typography>
            <Typography variant="body1">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Account Type
            </Typography>
            <Typography variant="body1">
              {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Storage Used
            </Typography>
            <Typography variant="body1">
              2.3 MB of 1 GB
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your projects, tasks, and data will be permanently deleted.
          </Alert>
          <Typography variant="body1" gutterBottom>
            To confirm deletion, please type <strong>DELETE</strong> in the field below:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="outlined"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleteConfirmation !== 'DELETE'}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;