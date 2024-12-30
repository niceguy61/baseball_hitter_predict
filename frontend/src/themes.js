import { createTheme } from '@mui/material/styles';

const themes = () => {
  return createTheme({
    palette: {
      mode: 'light', // 또는 'dark'
      primary: {
        main: '#1976d2',  // 기본 primary 색상 설정
      },
      secondary: {
        main: '#dc004e',
      },
      error: {
        main: '#d32f2f',
      },
      warning: {
        main: '#ffa000',
      },
      info: {
        main: '#0288d1',
      },
      success: {
        main: '#388e3c',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    customShadows: {
      primaryButton: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      secondary: '0px 1px 3px rgba(0, 0, 0, 0.2)',
    },
  });
};

export default themes;
