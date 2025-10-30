import React from 'react';

import { Card, CardContent, CardMedia, Typography, Chip, Box, Stack, Divider, CircularProgress, Avatar, Paper } from '@mui/material';
import Rating from '@mui/material/Rating';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import HotelIcon from '@mui/icons-material/Hotel';
import Grid from '@mui/material/Grid';
import Slider from "react-slick";
import BedIcon from '@mui/icons-material/Bed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const HotelOverview = ({ hotel }) => {
    // ✅ Handle both old structure and GoGlobal structure
    const hotelName = hotel.name || hotel.hotelName || 'Hotel';
    const description = hotel.description || 'No description available';
    const hotelRating = hotel.rating || hotel.Rating || 0;

    // ✅ Extract images from thumbnails array or use photo
    const images = hotel.thumbnails?.map(thumb => thumb.value) ||
        (Array.isArray(hotel.photo) ? hotel.photo : [hotel.photo]) ||
        [];
    const mainImage = images[0] || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';

    // ✅ Parse facilities from GoGlobal HTML string or array
    const parseFacilities = (facilitiesData) => {
        if (!facilitiesData) return [];

        // If it's already an array, return it
        if (Array.isArray(facilitiesData)) return facilitiesData;

        // If it's a string, parse it
        if (typeof facilitiesData === 'string') {
            return facilitiesData
                .split('<BR />')
                .map(f => f.trim())
                .filter(f => f.length > 0);
        }

        return [];
    };

    const hotelFacilities = parseFacilities(hotel.HotelFacilities);
    const roomFacilities = parseFacilities(hotel.RoomFacilities);
    const allFacilities = [...hotelFacilities, ...roomFacilities];

    // ✅ Combine tags from old structure with facilities from new structure
    const tags = hotel.tags || allFacilities.slice(0, 15); // Limit to 15 for display

    const getRatingCategory = (rating) => {
        if (rating >= 4.5) return { text: 'Excellent', color: '#4caf50' };
        if (rating >= 4.0) return { text: 'Very Good', color: '#8bc34a' };
        if (rating >= 3.5) return { text: 'Good', color: '#ffc107' };
        if (rating >= 3.0) return { text: 'Fair', color: '#ff9800' };
        return { text: 'Poor', color: '#f44336' };
    };

    // ✅ Handle address - GoGlobal doesn't provide detailed address
    const fullAddress = hotel.address
        ? hotel.address : 'Address not available';

    const ratingInfo = getRatingCategory(parseFloat(hotelRating));

    return (
        <>
            <Card
                elevation={4}
                sx={{
                    mt: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: 2,
                    mb: 3
                }}
            >
                {/* Hero Image Section with Slider if multiple images */}
                <Box sx={{ position: 'relative' }}>
                    {images.length > 1 ? (
                        <Box sx={{ position: 'relative' }}>
                            <Slider
                                dots={true}
                                infinite={true}
                                speed={500}
                                slidesToShow={1}
                                slidesToScroll={1}
                                arrows={true}
                                autoplay={true}
                                autoplaySpeed={4000}
                            >
                                {images.map((img, idx) => (
                                    <Box key={idx}>
                                        <CardMedia
                                            component="img"
                                            height="400"
                                            image={img}
                                            alt={`${hotelName} ${idx + 1}`}
                                            sx={{
                                                objectFit: 'cover',
                                                filter: 'brightness(0.9)'
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    ) : (
                        <CardMedia
                            component="img"
                            height="400"
                            image={mainImage}
                            alt={hotelName}
                            sx={{
                                objectFit: 'cover',
                                filter: 'brightness(0.9)'
                            }}
                        />
                    )}

                    {/* Overlay gradient */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            zIndex: 1
                        }}
                    />

                    {/* Rating Badge */}
                    {hotelRating > 0 && (
                        <Paper
                            elevation={3}
                            sx={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                p: 1,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: 'white',
                                backdropFilter: 'blur(10px)',
                                zIndex: 2,
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: 'primary.main 0px 2px 4px -1px, primary.main 0px 4px 5px 0px, primary.main 0px 1px 10px 0px'
                            }}
                        >
                            <StarIcon sx={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFED4A 50%, #DAA520 75%, #FFD700 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: 20,
                                filter: 'drop-shadow(0 1px 2px rgba(198, 198, 198, 0.8))',
                                color: '#FFD700'
                            }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {hotelRating}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    fontSize: '0.8rem'
                                }}
                            >
                                {ratingInfo.text}
                            </Typography>
                        </Paper>
                    )}

                    {/* Hotel Category Badge */}
                    <Chip
                        icon={<HotelIcon />}
                        label="Hotel"
                        sx={{
                            p: 1,
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 'bold',
                            zIndex: 2
                        }}
                    />
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Stack direction="column" spacing={2} alignItems="left">
                        {/* Hotel Name and Description */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    lineHeight: 1.2
                                }}
                            >
                                {hotelName}
                            </Typography>


                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.6,
                                    fontSize: '1.1rem',
                                    mt: 2
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: description
                                        .replace(/<br\s*\/?>/gi, '<br/>') // normalize <br>
                                        .substring(0, 2000) + (description.length > 2000 ? '...' : '')
                                }}
                            />
                        </Box>

                        {/* Location Section */}
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    color: 'text.primary'
                                }}
                            >
                                Location
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <LocationOnIcon
                                    sx={{
                                        color: 'primary.main',
                                        mt: 0.2,
                                        fontSize: 20
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {fullAddress}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Amenities/Tags Section */}
                        {tags && tags.length > 0 && (
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 2,
                                        color: 'text.primary'
                                    }}
                                >
                                    Amenities & Features
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1.5
                                }}>
                                    {tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            variant="outlined"
                                            sx={{
                                                textTransform: 'capitalize',
                                                fontWeight: 500,
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: 'primary.50',
                                                    borderColor: 'primary.main'
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Additional Facilities Details (if available from GoGlobal) */}
            {(hotelFacilities.length > 15 || roomFacilities.length > 0) && (
                <Card elevation={2} sx={{ mb: 3, p: 3 }}>
                    {hotelFacilities.length > 15 && (
                        <Box sx={{ mb: roomFacilities.length > 0 ? 3 : 0 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HotelIcon color="primary" /> Hotel Facilities
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {hotelFacilities.map((facility, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={idx}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleIcon color="primary" fontSize="small" />
                                            <Typography variant="body2">{facility}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {roomFacilities.length > 0 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BedIcon color="primary" /> Room Facilities
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {roomFacilities.map((facility, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={idx}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleIcon color="primary" fontSize="small" />
                                            <Typography variant="body2">{facility}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Card>
            )}
        </>
    );
};

export default HotelOverview;