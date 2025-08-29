import { createTheme } from '@mui/material/styles';

const palette = {
  primary: {
    main: '#1976d2', // Blue
    contrastText: '#ffffff', // White
  },
  secondary: {
    main: '#ff4081', // Pink
    contrastText: '#ffffff', // White
  },
  background: {
    default: '#f4f6f8', // Light grey
    paper: '#ffffff', // White
  },
  text: {
    primary: '#333333', // Dark grey
    secondary: '#666666', // Medium grey
  },
  error: {
    main: '#f44336', // Red
  },
  warning: {
    main: '#ff9800', // Orange
  },
  info: {
    main: '#2196f3', // Light blue
  },
  success: {
    main: '#4caf50', // Green
  },
};

const theme = createTheme({
  palette,
});

export default theme;