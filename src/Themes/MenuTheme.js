import { createTheme } from '@mui/material/styles';

export const MenuTheme = createTheme({
  palette: {
    background: {
      default: '#121212',
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    primary: {
      main: '#3f51b5',
      light: 'rbga(101, 115, 195)',
      dark: 'rgba(44, 56, 126)',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#f50057',
      light: 'rgba(247, 51, 120)',
      dark: 'rgba(171, 0, 60)',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#f44336',
      light: 'rgba(229, 115, 115)',
      dark: 'rgba(211, 47, 47)',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#ff9800',
      light: 'rgba(255, 167, 38)',
      dark: 'rgba(200, 135, 0)',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#2196f3',
      light: 'rgba(77, 208, 225)',
      dark: 'rgba(0, 145, 234)',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#4caf50',
      light: 'rgba(111, 191, 115)',
      dark: 'rgba(53, 122, 56)',
      contrastText: '#FFFFFF'
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
});

