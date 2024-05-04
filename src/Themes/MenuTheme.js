import { createMuiTheme } from '@mui/material/styles';

export const MenuTheme = createMuiTheme({
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
    divider: 'rgba(255, 255, 255, 0.12)',
  },
});

