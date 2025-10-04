import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Fab,
  useTheme
} from '@mui/material';
import {
  Assignment,
  People,
  TrendingUp,
  Schedule,
  Add,
  MoreVert,
  CheckCircle,
  AccessTime,
  Warning
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, projectAPI, taskAPI } from '../services/apiServices';
import { toast } from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, projectsRes, tasksRes] = await Promise.all([
        analyticsAPI.getDashboardAnalytics(),
        projectAPI.getProjects({ limit: 5, sort: '-updatedAt' }),
        taskAPI.getTasks({ limit: 10, sort: '-updatedAt' })
      ]);

      setDashboardData(dashboardRes.data.data); // Note the nested data structure
      setRecentProjects(projectsRes.data.projects || []);
      setRecentTasks(tasksRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'todo':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'in-progress':
        return <AccessTime />;
      case 'todo':
        return <Schedule />;
      default:
        return <Schedule />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Chart configurations
  const productivityChartData = {
    labels: dashboardData?.productivity?.labels || [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: dashboardData?.productivity?.data || [],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        tension: 0.4,
      },
    ],
  };

  const taskDistributionData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          dashboardData?.taskDistribution?.todo || 0,
          dashboardData?.taskDistribution?.inProgress || 0,
          dashboardData?.taskDistribution?.completed || 0,
        ],
        backgroundColor: [
          theme.palette.grey[400],
          theme.palette.warning.main,
          theme.palette.success.main,
        ],
      },
    ],
  };

  const projectProgressData = {
    labels: recentProjects.map(p => p.name) || [],
    datasets: [
      {
        label: 'Progress %',
        data: recentProjects.map(p => p.progress) || [],
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Paper sx={{ p: 2, height: 140 }}>
                <LinearProgress />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your projects today.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Projects
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.totalProjects || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Tasks
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.completedTasks || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Team Members
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.teamMembers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Productivity
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.productivity?.current || 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Productivity Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={productivityChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Task Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut data={taskDistributionData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Projects and Tasks */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Projects
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {recentProjects.map((project) => (
              <Card key={project._id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={project.status}
                      color={project.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{project.progress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', mr: 2 }}>
                      {project.members?.slice(0, 3).map((member, index) => (
                        <Avatar
                          key={member._id}
                          src={member.avatar}
                          sx={{
                            width: 24,
                            height: 24,
                            ml: index > 0 ? -1 : 0,
                            border: 2,
                            borderColor: 'background.paper'
                          }}
                        >
                          {member.firstName?.[0]}{member.lastName?.[0]}
                        </Avatar>
                      ))}
                      {project.members?.length > 3 && (
                        <Avatar sx={{ width: 24, height: 24, ml: -1, fontSize: '0.7rem' }}>
                          +{project.members.length - 3}
                        </Avatar>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Due {new Date(project.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Tasks
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {recentTasks.map((task) => (
              <Card key={task._id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: getTaskStatusColor(task.status) + '.main' }}>
                      {getTaskStatusIcon(task.status)}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                          size="small"
                        />
                        <Chip
                          label={task.status}
                          color={getTaskStatusColor(task.status)}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {task.assignee && (
                            <Avatar
                              src={task.assignee.avatar}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            >
                              {task.assignee.firstName?.[0]}{task.assignee.lastName?.[0]}
                            </Avatar>
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {task.assignee?.firstName} {task.assignee?.lastName}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Project Progress Chart */}
      {recentProjects.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Project Progress Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={projectProgressData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Dashboard;