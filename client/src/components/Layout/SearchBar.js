import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Close,
  FolderOpen,
  Assignment,
  People,
  Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from '../../services/apiServices';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await searchAPI.globalSearch(searchQuery);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    switch (result.type) {
      case 'project':
        navigate(`/projects/${result.id}`);
        break;
      case 'task':
        navigate(`/tasks/${result.id}`);
        break;
      case 'user':
        navigate(`/team/${result.id}`);
        break;
      default:
        break;
    }
    onClose();
    setQuery('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'project':
        return <FolderOpen />;
      case 'task':
        return <Assignment />;
      case 'user':
        return <People />;
      case 'document':
        return <Description />;
      default:
        return <SearchIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'project':
        return 'primary';
      case 'task':
        return 'secondary';
      case 'user':
        return 'success';
      case 'document':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Search</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects, tasks, users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && query && results.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No results found for "{query}"
          </Typography>
        )}

        {!loading && results.length > 0 && (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {results.map((result, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleResultClick(result)}>
                  <ListItemIcon>{getIcon(result.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">{result.title}</Typography>
                        <Chip
                          label={result.type}
                          size="small"
                          color={getTypeColor(result.type)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={result.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        {!query && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Recent searches and suggestions will appear here
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label="My Projects" size="small" variant="outlined" />
              <Chip label="Pending Tasks" size="small" variant="outlined" />
              <Chip label="Team Members" size="small" variant="outlined" />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;