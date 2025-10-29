import { Stack, Typography, Box, Container, Grid, Card, CardContent, Fade, Chip } from "@mui/material"
import SearchBar from "../SearchHotelContext/SearchBar";
import React from "react";
import { keyframes } from '@mui/system';
import HotelIcon from '@mui/icons-material/Hotel';


const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const WelcomePage = () => {
    return (
        <React.Fragment>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '85vh',
                    backgroundColor: 'grey.800',
                    color: '#fff',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url("https://r-xx.bstatic.com/xdata/images/xphoto/2880x868/313564245.jpeg?k=c677d4c63f8a8218d275614559b8ccd5dc5f169b44667c3ff46328091c225b13&o=")`,

                }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Stack spacing={4}
                        alignItems={'center'}
                        sx={{
                            position: 'relative',
                            animation: `${fadeInUp} 1s ease-out`,
                            p: { xs: 3, md: 6 }
                        }}>
                        <Box sx={{
                            animation: `${float} 3s ease-in-out infinite`,
                            mb: 2
                        }}>
                            <HotelIcon sx={{
                                fontSize: 60,
                                color: 'white',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                            }} />
                        </Box>
                        <Typography component="h1" variant="h3" color="inherit"
                            sx={{
                                fontWeight: 'medium'
                            }}
                            gutterBottom>
                            A dream stay
                            for a bucket list trip
                        </Typography>
                        <Typography variant="h5" color="inherit">
                            Make it a trip to remember in a holiday home
                        </Typography>
                       <Box sx={{ my: 3, justifySelf: 'center',width: '100%' }}>
                                           <SearchBar />
                                       </Box>
                    </Stack>

                </Container>
            </Box>
        </React.Fragment >);
};