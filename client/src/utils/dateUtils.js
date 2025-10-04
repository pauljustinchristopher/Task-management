import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Format date with relative context
export const formatDateWithContext = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow, ${format(dateObj, 'h:mm a')}`;
  }
  
  return format(dateObj, 'MMM dd, yyyy h:mm a');
};

// Check if date is overdue
export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

// Get days until due date
export const getDaysUntilDue = (date) => {
  if (!date) return null;
  
  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Format due date status
export const formatDueStatus = (date) => {
  if (!date) return null;
  
  const days = getDaysUntilDue(date);
  
  if (days < 0) {
    return {
      text: `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`,
      color: 'error',
      urgent: true,
    };
  }
  
  if (days === 0) {
    return {
      text: 'Due today',
      color: 'warning',
      urgent: true,
    };
  }
  
  if (days === 1) {
    return {
      text: 'Due tomorrow',
      color: 'warning',
      urgent: false,
    };
  }
  
  if (days <= 7) {
    return {
      text: `Due in ${days} day${days === 1 ? '' : 's'}`,
      color: 'info',
      urgent: false,
    };
  }
  
  return {
    text: `Due in ${days} day${days === 1 ? '' : 's'}`,
    color: 'default',
    urgent: false,
  };
};