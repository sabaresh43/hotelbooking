import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Button, Box, Stack, Divider, Alert, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { useReward } from 'react-rewards';
import dayjs from "dayjs";
import hotelService from "../../services/hotel.service";

// Safe JSON parser
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value; // return raw string if it's not JSON
  }
};

export default function Success() {

  const { reward } = useReward('rewardId', 'confetti');

  // Safely parse all localStorage values
  const bookdata = safeParse(localStorage.getItem('bookingPayload'));
  let payment_reference = safeParse(localStorage.getItem('Payment_reference'));
  const datas = safeParse(localStorage.getItem('pendingBooking'));

  const [bookingResponse, setBookingResponse] = useState(null);

  const confirmation = datas?.confirmation;
  const bookingData = datas || {};

  const currency = confirmation?.Currency || bookingData?.rooms?.[0]?.Currency || 'USD';

  const totalPaid =
    confirmation?.TotalPrice ||
    bookingData?.rooms?.reduce((sum, room) => sum + (parseFloat(room.TotalPrice) || 0), 0) || 0;

  const isValidTotal = !isNaN(totalPaid) && totalPaid > 0;

  // Prevent multiple API calls
  const calledRef = useRef(false);

  useEffect(() => {
    reward();
  }, [reward]);

  useEffect(() => {
    console.log("bookdata", bookdata);

    if (!calledRef.current && bookdata) {
      calledRef.current = true; // ensures bookTheHotel runs only once
      console.log("Calling bookTheHotel only once!");
      bookTheHotel();
    }
  }, [bookdata]);

  const bookTheHotel = async () => {
    console.log("bookTheHotel called");

    try {
      const res = await hotelService.bookHotel({
        ...bookdata,
        payment_reference,
      });

      setBookingResponse(res);
      console.log("📥 Booking response:", res);

    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', px: 6, paddingBottom: 6, mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: '1400px',
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            mx: 'auto',
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'success.light',
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 350
            }}
          >
            <span id="rewardId" style={{ display: "inline-block", marginTop: 56, marginLeft: 30, paddingLeft: 20 }}>
              <CheckCircleIcon sx={{ fontSize: 120, color: 'success.main', mb: 5 }} />
            </span>

            <Typography variant="h4" fontWeight="600" id="rewardId" textAlign="center">
              Booking Confirmed!
            </Typography>

            <Typography color="text.secondary" textAlign="center" mt={1}>
              Your booking details have been sent to your registered email.
            </Typography>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, width: '100%' }}>
              <Typography variant="caption" color="text.secondary">
                Booking Reference
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {bookdata?.BookingId || bookingResponse?.booking_id || 15721065094}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Confirmation Code
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {payment_reference}
              </Typography>
            </Box>
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ flex: 1.5, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" mb={3}>Booking Summary</Typography>
            <Divider sx={{ mb: 3 }} />

            {datas ? (
              <Stack spacing={2}>

                <Typography>
                  <strong>Hotel:</strong> {datas?.hotel?.name}
                </Typography>

                <Box>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>Rooms:</Typography>

                  <Box sx={{ pl: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {datas.rooms?.length} × {datas.rooms?.[0]?.Description}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {datas.rooms?.[0]?.RoomBasis}
                    </Typography>

                    {bookingData.occupancy?.map((occ, index) => (
                      <Typography key={index} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Room {index + 1}: {occ.adults} adult{occ.adults > 1 ? 's' : ''}
                        {occ.childAges.length > 0 &&
                          `, ${occ.childAges.length} child (ages: ${occ.childAges.join(', ')})`
                        }
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Typography>
                  <strong>Duration:</strong> {confirmation?.Nights || bookingData.duration} nights
                </Typography>

                <Typography>
                  <strong>Check-in:</strong>{' '}
                  {confirmation?.ArrivalDate
                    ? dayjs(confirmation.ArrivalDate).format('dddd, MMMM D, YYYY')
                    : bookingData.from
                      ? dayjs(bookingData.from).format('dddd, MMMM D, YYYY')
                      : 'N/A'}
                </Typography>

                <Typography>
                  <strong>Check-out:</strong>{' '}
                  {bookingData.to ? dayjs(bookingData.to).format('dddd, MMMM D, YYYY') : 'N/A'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Price Summary</Typography>

                    {bookingData.rooms?.map((room, index) => {
                      const allTaxes = room.Tax || [];
                      const inclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Inclusive");
                      const nonInclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Not Inclusive");
                      const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + (parseFloat(tax.Amount) || 0), 0);

                      const basePrice = parseFloat(room.TotalPrice || 0);
                      const roomTotal = basePrice + totalNonInclusiveTax;

                      return (
                        <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px dashed #e0e0e0' }}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            Room {index + 1}: {room.Description}
                          </Typography>

                          <Stack direction="row" justifyContent="space-between" sx={{ pl: 2 }}>
                            <Typography variant="body2">Room price</Typography>
                            <Typography variant="body2">{currency} {basePrice.toFixed(2)}</Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" sx={{ pl: 2 }}>
                            <Typography variant="caption">Tax</Typography>
                            <Typography variant="caption">{currency} {totalNonInclusiveTax.toFixed(2)}</Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" sx={{ pl: 2, mt: 1 }}>
                            <Typography fontWeight={600}>Room Total:</Typography>
                            <Typography fontWeight={600}>{currency} {roomTotal.toFixed(2)}</Typography>
                          </Stack>
                        </Box>
                      );
                    })}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "success.light", p: 2, borderRadius: 1 }}>
                      <Typography variant="h6" fontWeight="bold">Total Paid</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {isValidTotal ? `${currency} ${totalPaid.toFixed(2)}` : 'N/A'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {confirmation?.CancellationDeadline && (
                  <Alert severity="info">
                    Free cancellation until {dayjs(confirmation.CancellationDeadline).format('MMMM D, YYYY')}
                  </Alert>
                )}

                {confirmation?.BookingStatus && (
                  <Alert severity="success">
                    <strong>Status:</strong> {confirmation.BookingStatus.status} - {confirmation.BookingStatus.desc}
                  </Alert>
                )}

              </Stack>
            ) : (
              <Typography color="text.secondary">Booking details not available.</Typography>
            )}

            <Stack direction="row" spacing={2} mt={4}>
              <Button component={Link} variant="contained" to="/Bookings">View My Bookings</Button>
              <Button component={Link} variant="outlined" to="/">Go to Home</Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
