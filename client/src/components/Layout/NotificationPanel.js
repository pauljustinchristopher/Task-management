import React, { useState, useEffect } from 'react';
import {
  Popover,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Box,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  Notifications,
  Assignment,
  FolderOpen,
  Comment,
  PersonAdd,
  Warning,
  CheckCircle,
  Info,
  Close
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { notificationAPI } from '../../services/apiServices';

const NotificationPanel = ({ anchorEl, open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned':
        return <Assignment color="primary" />;
      case 'task_completed':
        return <CheckCircle color="success" />;
      case 'project_invite':
        return <FolderOpen color="info" />;
      case 'comment':
        return <Comment color="secondary" />;
      case 'team_invite':
        return <PersonAdd color="warning" />;
      case 'deadline':
        return <Warning color="error" />;
      default:
        return <Info />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task_assigned':
        return 'primary';
      case 'task_completed':
        return 'success';
      case 'project_invite':
        return 'info';
      case 'comment':
        return 'secondary';
      case 'team_invite':
        return 'warning';
      case 'deadline':
        return 'error';
      default:
        return 'default';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { width: 400, maxHeight: 500 }
      }}
    >
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Notifications
              {unreadCount > 0 && (
                <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
              )}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{ mt: 1 }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
          {loading ? (
            <ListItem>
              <ListItemText primary="Loading notifications..." />
            </ListItem>
          ) : notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No notifications" 
                secondary="You're all caught up!"
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer'
                  }}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.type.replace('_', ' ')}
                          size="small"
                          color={getNotificationColor(notification.type)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                  />
                  {!notification.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        ml: 1
                      }}
                    />
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Button size="small" color="primary">
              View All Notifications
            </Button>
          </Box>
        )}
      </Paper>
    </Popover>
  );
};

export default NotificationPanel;