import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  Chip
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HotelIcon from "@mui/icons-material/Hotel";

export default function BookingCard({
  img,
  hotelName,
  statusLabel,
  statusColor,
  checkIn,
  checkOut,
  roomBasis,
  roomCategory,
  amount,
  onViewDetails,
  onCancel
}) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        p: 2,
        borderRadius: 3,
        boxShadow: 2,
        height: "100%",
        width: "100%", // Make sure it takes full width of grid item
        maxWidth: "100%", // Remove any fixed maxWidth
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)"
        }
      }}
    >
      {/* Left Image */}
      <CardMedia
        component="img"
        image={img}
        alt="hotel"
        sx={{
          width: { xs: "100%", sm: 200 }, // Reduced image width for 2-column layout
          height: { xs: 160, sm: "auto" },
          borderRadius: 2,
          objectFit: "cover",
          flexShrink: 0 // Prevent image from shrinking
        }}
      />

      {/* Right Section */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          pl: { sm: 2 },
          pt: { xs: 2, sm: 0 },
          width: "100%",
          "&:last-child": { pb: 2 }
        }}
      >

        {/* Header: Hotel Name + Status */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" fontWeight={600} display="flex" gap={1} color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
            <HotelIcon fontSize="small" />
            {hotelName}
          </Typography>
          <Chip label={statusLabel} color={statusColor} size="small" />
        </Box>

        {/* Dates */}
        <Box display="flex" gap={1} mb={2}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              <b>Check-in:</b> {checkIn}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              <b>Check-out:</b> {checkOut}
            </Typography>
          </Box>
        </Box>

        {/* Room Details */}
        <Box mb={2}>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mb: 0.5 }}>
            <b>Room Category:</b> {roomCategory || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            <b>Room Basis:</b> {roomBasis || 'N/A'}
          </Typography>
        </Box>


        {/* Amount */}
        <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
          € {amount}
        </Typography>

        {/* Action Buttons */}
        <Box display="flex" gap={2} mt="auto">
          <Button
            variant="contained"
            fullWidth
            onClick={onViewDetails}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            View Details
          </Button>

          {statusLabel !== 'Failed' && statusLabel !== 'Cancelled' && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={onCancel}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                py: 1.2,
                borderRadius: 2,
                borderWidth: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  backgroundColor: 'error.main',
                  color: 'white'
                }
              }}
            >
              Cancel
            </Button>
          )}
        </Box>

      </CardContent>
    </Card>
  );
}