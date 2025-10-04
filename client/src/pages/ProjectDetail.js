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
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { projectAPI, taskAPI } from '../services/apiServices';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectAPI.getProject(id),
        taskAPI.getTasks({ project: id })
      ]);

      setProject(projectRes.data);
      setTasks(tasksRes.data || []);
      
      // You can add members and activities fetch here
      setMembers(projectRes.data?.members || []);
      setActivities([]);
    } catch (error) {
      toast.error('Failed to fetch project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const taskData = {
        ...taskFormData,
        project: id,
        dueDate: taskFormData.dueDate ? new Date(taskFormData.dueDate) : null
      };

      await taskAPI.createTask(taskData);
      toast.success('Task created successfully');
      setOpenTaskDialog(false);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchProjectDetails();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'planning': return 'warning';
      case 'on-hold': return 'error';
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

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'todo': return 'warning';
      case 'review': return 'info';
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

  if (!project) {
    return (
      <Container>
        <Typography variant="h4">Project not found</Typography>
      </Container>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/projects')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {project.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/projects/${id}/edit`)}
          sx={{ mr: 2 }}
        >
          Edit Project
        </Button>
      </Box>

      {/* Project Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {project.description}
              </Typography>
              
              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={project.status.replace('-', ' ').toUpperCase()}
                  color={getStatusColor(project.status)}
                  size="small"
                />
                <Chip
                  label={project.priority.toUpperCase()}
                  color={getPriorityColor(project.priority)}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {project.deadline && (
                <Typography variant="body2" color="text.secondary">
                  Due: {format(new Date(project.deadline), 'PPP')}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Tasks Completed</Typography>
                  <Typography variant="body2">{completedTasks}/{tasks.length}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progressPercentage} />
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progressPercentage)}% Complete
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            icon={<TaskIcon />} 
            label={`Tasks (${tasks.length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<PeopleIcon />} 
            label={`Members (${members.length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<TimelineIcon />} 
            label="Activity" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Tasks</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenTaskDialog(true)}
            >
              Add Task
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 }
                  }}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {task.description}
                    </Typography>
                    <Box display="flex" gap={1} mb={1}>
                      <Chip
                        label={task.status.replace('-', ' ').toUpperCase()}
                        color={getTaskStatusColor(task.status)}
                        size="small"
                      />
                      <Chip
                        label={task.priority.toUpperCase()}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    {task.dueDate && (
                      <Typography variant="caption" color="text.secondary">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Project Members
          </Typography>
          <List>
            {members.map((member, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    {member.user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.user?.name}
                  secondary={`${member.role} • ${member.user?.email}`}
                />
                <Chip 
                  label={member.role.toUpperCase()} 
                  size="small" 
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Activity timeline will be displayed here
          </Typography>
        </Box>
      )}

      {/* Create Task Dialog */}
      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={taskFormData.title}
            onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={taskFormData.description}
            onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Priority"
            fullWidth
            value={taskFormData.priority}
            onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
          <TextField
            margin="normal"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={taskFormData.dueDate}
            onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetail;