import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import dayjs from "dayjs";
import { useMediaQuery, useTheme } from "@mui/material";

function ViewBookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  console.log("Location State:", location.state);

  // If bookingDetails is coming directly in the state, let's use it directly
  const bookingDetails =
    location.state?.data || location.state?.bookingDetails || {};

  // Calculate total price including taxes and fees
  const calculateTotalPrice = () => {
    if (bookingDetails.Hotel?.IncludedFeeList) {
      const taxesAndFees = bookingDetails.Hotel.IncludedFeeList.reduce(
        (total, fee) => total + (fee.Amount || 0),
        0
      );
      return {
        basePrice:
          bookingDetails.Hotel.TotalPrice || bookingDetails.TotalPrice || 0,
        taxesAndFees,
        totalPrice:
          (bookingDetails.Hotel.TotalPrice || bookingDetails.TotalPrice || 0) +
          taxesAndFees,
        currency:
          bookingDetails.Hotel?.Currency || bookingDetails.Currency || "USD",
      };
    }
    return {
      basePrice: bookingDetails.TotalPrice || 0,
      taxesAndFees: 0,
      totalPrice: bookingDetails.TotalPrice || 0,
      currency: bookingDetails.Currency || "USD",
    };
  };

  const priceDetails = calculateTotalPrice();

  // Early return if no booking details
  if (!bookingDetails || Object.keys(bookingDetails).length === 0) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          No booking details available. Please try again.
        </Typography>
        <Button
          size="large"
          onClick={() => navigate(-1)}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container
      sx={{
        mt: 5,
        mx: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Stack direction="column" spacing={2}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary">
              Hotel Info
            </Typography>
            <Typography variant="h6" gutterBottom>
              {bookingDetails.Hotel?.HotelName ||
                bookingDetails.HotelName ||
                "Hotel name not available"}
            </Typography>
            {bookingDetails.Hotel?.Destination && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  City Code:{" "}
                  {bookingDetails.Hotel.Destination.CityCode ||
                    bookingDetails.CityCode ||
                    "N/A"}
                </Typography>
              </Stack>
            )}
          </CardContent>
        </Card>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              alignItems="flex-start"
              spacing={2}
              divider={
                <Divider
                  orientation={isLgUp ? "vertical" : "horizontal"}
                  flexItem
                />
              }
            >
              <Box>
                <Typography color="text.secondary">Check-in</Typography>
                <Typography variant="subtitle1">
                  {dayjs(
                    bookingDetails.CheckInDate ||
                      bookingDetails.ArrivalDate ||
                      bookingDetails.from
                  ).format("dddd, MMMM D, YYYY")}
                </Typography>
                <Typography variant="body2">From 16:00</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">Check-out</Typography>
                <Typography variant="subtitle1">
                  {dayjs(
                    bookingDetails.CheckOutDate || bookingDetails.to
                  ).format("dddd, MMMM D, YYYY")}
                </Typography>
                <Typography variant="body2">Until 12:00</Typography>
              </Box>
            </Stack>
            <Typography color="text.secondary" mt={2}>
              Total length of stay:
            </Typography>
            <Typography variant="body1">
              {bookingDetails.Nights || bookingDetails.duration || 1}{" "}
              {(bookingDetails.Nights || bookingDetails.duration || 1) > 1
                ? "nights"
                : "night"}
            </Typography>
            <Typography color="text.secondary" mt={1}>
              You selected
            </Typography>
            <Typography variant="body1">
              {bookingDetails.NumOfRooms || 1}{" "}
              {(bookingDetails.NumOfRooms || 1) > 1 ? "rooms" : "room"}
            </Typography>
            {/* Room Details */}
            {bookingDetails.Hotel?.RatePlanList ? (
              bookingDetails.Hotel.RatePlanList.map((room, index) => (
                <Box key={index} mt={1}>
                  <Typography variant="body2" mt={0.5}>
                    <strong>Room Type:</strong> {room.RoomName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Bed Type:</strong> {room.BedType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Max Occupancy:</strong> {room.MaxOccupancy} persons
                  </Typography>
                  {room.BreakfastType && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Breakfast:</strong> Included
                    </Typography>
                  )}
                </Box>
              ))
            ) : bookingDetails.Rooms?.RoomType ? (
              <Box mt={1}>
                <Typography variant="body2">
                  <strong>Room Type:</strong>{" "}
                  {bookingDetails.Rooms.RoomType.Room.Category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Adults:</strong>{" "}
                  {bookingDetails.Rooms.RoomType.Adults || 1}
                </Typography>
                {bookingDetails.RoomBasis && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Basis:</strong> {bookingDetails.RoomBasis}
                  </Typography>
                )}
              </Box>
            ) : null}
          </CardContent>
        </Card>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Summary
            </Typography>
            <Stack spacing={2}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography>Room Price</Typography>
                <Typography>
                  {priceDetails.currency} {priceDetails.basePrice.toFixed(2)}
                </Typography>
              </Box>
              {priceDetails.taxesAndFees > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography>Taxes and Fees</Typography>
                  <Typography>
                    {priceDetails.currency}{" "}
                    {priceDetails.taxesAndFees.toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: { md: "space-between" },
                  bgcolor: "primary.main",
                  color: "common.white",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5">Total Price</Typography>
                <Typography variant="h5">
                  {priceDetails.currency} {priceDetails.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <Stack direction="column" spacing={2}>
        <Card sx={{ boxShadow: 3, px: 1 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Personal Details
            </Typography>
            <Grid container columnSpacing={0} rowSpacing={1}>
              <Grid size={6}>
                <Typography variant="body1">First Name</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">
                  {bookingDetails.Contact?.Name?.First ||
                    bookingDetails.Rooms?.RoomType?.Room?.PersonName
                      ?.FirstName ||
                    "N/A"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">Last Name</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">
                  {bookingDetails.Contact?.Name?.Last ||
                    bookingDetails.Rooms?.RoomType?.Room?.PersonName
                      ?.LastName ||
                    "N/A"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">Email</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">
                  {bookingDetails.Contact?.Email || "N/A"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">Phone</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1">
                  {bookingDetails.Contact?.Phone || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {location.state.bookingDetails.cardInfo && (
          <Card sx={{ boxShadow: 3, px: 1 }}>
            <CardContent>
              <Grid container columnSpacing={0} rowSpacing={1}>
                {location.state.bookingDetails.cardInfo.address && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Billing Address
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {location.state.bookingDetails.cardInfo.address.street}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {location.state.bookingDetails.cardInfo.address.city},{" "}
                      {location.state.bookingDetails.cardInfo.address.province}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {
                        location.state.bookingDetails.cardInfo.address
                          .postalCode
                      }
                      ,{" "}
                      {location.state.bookingDetails.cardInfo.address.country.toUpperCase()}
                    </Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: 2, md: 0 } }}>
                  <Grid size={12}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Payment Details
                    </Typography>
                  </Grid>
                  <Grid container size={12} columnSpacing={0} rowSpacing={1}>
                    <Grid size={6}>
                      <Typography variant="body1" gutterBottom>
                        Card Holder Name
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" gutterBottom>
                        {location.state.bookingDetails.cardInfo.cardName}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" gutterBottom>
                        Card Number
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" gutterBottom>
                        {"xxxx-xxxx-xxxx-" +
                          location.state.bookingDetails.cardInfo.cardNumber.slice(
                            -4
                          )}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" gutterBottom>
                        Expiry Date
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" gutterBottom>
                        {`${location.state.bookingDetails.cardInfo.expDate.substring(
                          0,
                          2
                        )}/${location.state.bookingDetails.cardInfo.expDate.substring(
                          2
                        )}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {" "}
          {/* Use flexbox to align the button */}
          <Button
            size="large"
            onClick={goBack}
            variant="contained"
            color="primary"
            sx={{ alignSelf: "flex-end", fontSize: 16 }} // Align the button to the end of the flex container
          >
            Back
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default ViewBookingDetails;
