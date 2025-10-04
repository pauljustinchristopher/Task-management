import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Comment as CommentIcon,
  Assignment as TaskIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { taskAPI, projectAPI } from '../services/apiServices';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project: '',
    dueDate: ''
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
      fetchProjects();
    }
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskAPI.getTask(id);
      const taskData = response.data;
      
      setTask(taskData);
      setFormData({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        project: taskData.project?._id || '',
        dueDate: taskData.dueDate ? format(new Date(taskData.dueDate), 'yyyy-MM-dd') : ''
      });
      
      // Mock comments for now
      setComments([
        {
          id: 1,
          user: { name: 'John Doe', avatar: '' },
          content: 'This looks good. Let me review the implementation.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 2,
          user: { name: 'Jane Smith', avatar: '' },
          content: 'I have some suggestions for improvement.',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch task details');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects');
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null
      };

      await taskAPI.updateTask(id, updateData);
      toast.success('Task updated successfully');
      setEditing(false);
      fetchTaskDetails();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project: task.project?._id || '',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
    });
    setEditing(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await taskAPI.updateTask(id, { status: newStatus });
      toast.success('Task status updated');
      fetchTaskDetails();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would make an API call
      const comment = {
        id: Date.now(),
        user: { name: 'Current User', avatar: '' },
        content: newComment,
        createdAt: new Date()
      };
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'todo': return 'warning';
      case 'review': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  if (!task) {
    return (
      <Container>
        <Typography variant="h4">Task not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/tasks')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <TaskIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {editing ? (
            <TextField
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="standard"
              fullWidth
              sx={{ fontSize: '2rem' }}
            />
          ) : (
            task.title
          )}
        </Typography>
        {!editing ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
          >
            Edit Task
          </Button>
        ) : (
          <Box>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Task Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1" paragraph>
                  {task.description || 'No description provided'}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Quick Status Update */}
          {!editing && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {['todo', 'in-progress', 'review', 'completed'].map((status) => (
                    <Button
                      key={status}
                      variant={task.status === status ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleStatusUpdate(status)}
                      disabled={task.status === status}
                    >
                      {status.replace('-', ' ').toUpperCase()}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comments ({comments.length})
              </Typography>
              
              {/* Add Comment */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  variant="outlined"
                />
                <Box mt={1} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="small"
                  >
                    Add Comment
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Comments List */}
              <List>
                {comments.map((comment, index) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        {comment.user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {comment.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(comment.createdAt, 'PPp')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Task Properties */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Properties
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                {editing ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="review">Review</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                ) : (
                  <Chip
                    label={task.status.replace('-', ' ').toUpperCase()}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Priority
                </Typography>
                {editing ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>
                ) : (
                  <Chip
                    label={task.priority.toUpperCase()}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              {editing && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Project
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  >
                    <MenuItem value="">No Project</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Due Date
                </Typography>
                {editing ? (
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                ) : task.dueDate ? (
                  <Typography variant="body2">
                    {format(new Date(task.dueDate), 'PPP')}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No due date set
                  </Typography>
                )}
              </Box>

              {task.project && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Project
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      cursor: 'pointer',
                      color: 'primary.main',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => navigate(`/projects/${task.project._id}`)}
                  >
                    {task.project.name}
                  </Typography>
                </Box>
              )}

              {task.assignedTo && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Assigned To
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      {task.assignedTo.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {task.assignedTo.name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Task Metadata */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Created: {format(new Date(task.createdAt), 'PPp')}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Updated: {format(new Date(task.updatedAt), 'PPp')}
                </Typography>
              </Box>

              {task.createdBy && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Created by: {task.createdBy.name}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaskDetail;