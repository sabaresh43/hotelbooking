import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#252947',  // Your dark brand color
            contrastText: '#ffffff'  // Button text will be white on primary
        },
        secondary: {
            main: '#EF6B52',  // Your accent/secondary brand color
            contrastText: '#ffffff'
        }
    }
});

export default theme;
