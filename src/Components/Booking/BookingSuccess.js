import { Paper, Typography, Button, Box, Stack, Divider, Alert, Card, CardContent, } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useReward } from 'react-rewards';
import dayjs from "dayjs";

export default function BookingSuccess() {
    const { reward } = useReward('rewardId', 'confetti');
    const location = useLocation();
    const bookingData = location.state?.bookingData;
    const confirmation = bookingData?.confirmation;
    
    console.log('📄 Booking Data:', bookingData);
    console.log('✅ Confirmation:', confirmation);

    useEffect(() => {
        reward();
    }, [reward]);

    // ✅ Calculate total guests across all rooms
    const totalAdults = bookingData?.occupancy?.reduce((sum, occ) => sum + occ.adults, 0) || bookingData?.numberOfGuest || 0;
    const totalChildren = bookingData?.occupancy?.reduce((sum, occ) => sum + occ.childAges.length, 0) || 0;
    const totalRooms = bookingData?.rooms?.length || 0;

    // ✅ CRITICAL FIX: Calculate total from ALL rooms
const calculateTotalPrice = () => {
        if (!bookingData?.rooms || bookingData.rooms.length === 0) return 0;
        
        const total = bookingData.rooms.reduce((sum, room, index) => {
            const basePrice = parseFloat(room.TotalPrice || room.baseRate || 0);
            
            // Taxes
            const nonInclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Not Inclusive") || [];
            const totalTax = nonInclusiveTaxes.reduce((taxSum, tax) => taxSum + (parseFloat(tax.Amount) || 0), 0);
            
            // ✅ Fees (your data has fees in Fee array!)
            const fees = room.Fee || [];
            const totalFees = fees.reduce((feeSum, fee) => feeSum + (parseFloat(fee.Amount) || 0), 0);
            
            const roomTotal = basePrice + totalTax ;
            
            console.log(`💵 Room ${index + 1}: Base ${basePrice} + Tax ${totalTax} = ${roomTotal}`);
            
            return sum + roomTotal;
        }, 0);

        console.log('🧮 Calculated Total from all rooms:', total);
        return total;
    };

 const calculatedTotal = calculateTotalPrice();
    
    const totalPaid = parseFloat(
        bookingData?.actualTotalPrice ||           // First: Passed from BookingReview
        calculatedTotal ||                          // Second: Calculate from rooms
        bookingData?.totalPrice ||                 // Third: From booking context
        confirmation?.actualTotalPrice ||          // Fourth: From confirmation
        confirmation?.TotalPrice ||                // Last: From API (may be wrong)
        0
    );
    
    console.log('💵 Final Total Paid:', totalPaid);
    console.log('💰 actualTotalPrice:', bookingData?.actualTotalPrice);
    console.log('📦 Confirmation TotalPrice:', confirmation?.TotalPrice);
    
    const isValidTotal = !isNaN(totalPaid) && totalPaid > 0;
    const currency = confirmation?.Currency || bookingData?.rooms?.[0]?.Currency || 'USD';

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', px: 6, paddingBottom: 6 }}>
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
                {/* Left: Success Message */}
                <Box sx={{
                    flex: 1,
                    bgcolor: 'success.light',
                    p: { xs: 4, md: 6 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 350
                }}>
                    <CheckCircleIcon sx={{ fontSize: 120, color: 'success.main', mb: 3 }} />
                    <Typography variant="h4" fontWeight="600" id="rewardId" textAlign="center">
                        Booking Confirmed!
                    </Typography>
                    <Typography color="text.secondary" textAlign="center" mt={1}>
                        Your booking details have been sent to your registered email.
                    </Typography>

                    {confirmation && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, width: '100%' }}>
                            <Typography variant="caption" color="text.secondary">
                                Booking Reference
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                {confirmation.BookingId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Confirmation Code
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {confirmation.ClientReference}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Right: Booking Details */}
                <Box sx={{ flex: 1.5, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5" mb={3}>Booking Summary</Typography>
                    <Divider sx={{ mb: 3 }} />

                    {bookingData ? (
                        <Stack spacing={2}>
                            <Typography>
                                <strong>Hotel:</strong> {confirmation?.HotelName || bookingData.hotel?.name || bookingData.hotel?.hotelName}
                            </Typography>
                            
                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>Rooms:</Typography>
                                <Box sx={{ pl: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Typography variant="body1" fontWeight={600}>
                                        {bookingData.rooms.length} × {bookingData.rooms[0]?.Description || bookingData.rooms[0]?.Rooms?.[0] || 'Standard Room'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {bookingData.rooms[0]?.RoomBasis}
                                    </Typography>
                                    
                                    {bookingData.occupancy?.map((occ, index) => (
                                        <Typography key={index} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            Room {index + 1}: {occ.adults} adult{occ.adults > 1 ? 's' : ''}
                                            {occ.childAges.length > 0 && 
                                                `, ${occ.childAges.length} child${occ.childAges.length > 1 ? 'ren' : ''} (ages: ${occ.childAges.join(', ')})`
                                            }
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>

                            <Typography>
                                <strong>Total Guests:</strong> {totalAdults} adult{totalAdults > 1 ? 's' : ''}
                                {totalChildren > 0 && `, ${totalChildren} child${totalChildren > 1 ? 'ren' : ''}`}
                            </Typography>

                            <Typography>
                                <strong>Duration:</strong> {confirmation?.Nights || bookingData.duration} night{(confirmation?.Nights || bookingData.duration) > 1 ? 's' : ''}
                            </Typography>
                            <Typography>
                                <strong>Check-in:</strong> {confirmation?.ArrivalDate 
                                    ? dayjs(confirmation.ArrivalDate).format('dddd, MMMM D, YYYY') 
                                    : bookingData.from 
                                        ? (typeof bookingData.from === 'string' 
                                            ? dayjs(bookingData.from).format('dddd, MMMM D, YYYY')
                                            : bookingData.from.$d 
                                                ? dayjs(bookingData.from.$d).format('dddd, MMMM D, YYYY')
                                                : dayjs(bookingData.from).format('dddd, MMMM D, YYYY'))
                                        : 'N/A'
                                }
                            </Typography>
                            <Typography>
                                <strong>Check-out:</strong> {bookingData.to 
                                    ? (typeof bookingData.to === 'string'
                                        ? dayjs(bookingData.to).format('dddd, MMMM D, YYYY')
                                        : bookingData.to.$d
                                            ? dayjs(bookingData.to.$d).format('dddd, MMMM D, YYYY')
                                            : dayjs(bookingData.to).format('dddd, MMMM D, YYYY'))
                                    : 'N/A'
                                }
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            {/* ✅ Price breakdown for ALL rooms */}
                            <Card sx={{ boxShadow: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Price Summary</Typography>
                                    
                                    {bookingData.rooms?.map((room, index) => {
                                        const allTaxes = room.Tax || [];
                                        const inclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Inclusive");
                                        const nonInclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Not Inclusive");
                                        const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + (parseFloat(tax.Amount) || 0), 0);
                                        const basePrice = parseFloat(room.TotalPrice || room.baseRate || 0);
                                        const roomTotal = basePrice + totalNonInclusiveTax;

                                        return (
                                            <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < bookingData.rooms.length - 1 ? '1px dashed #e0e0e0' : 'none' }}>
                                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                                    Room {index + 1}: {room.Description}
                                                </Typography>
                                                
                                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5, pl: 2 }}>
                                                    <Typography variant="body2">
                                                        Room price ({bookingData.duration} {bookingData.duration > 1 ? 'nights' : 'night'})
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {currency} {basePrice.toFixed(2)}
                                                    </Typography>
                                                </Stack>

                                                {inclusiveTaxes.length > 0 && (
                                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5, pl: 2 }}>
                                                        <Typography variant="caption" color="success.main">
                                                            Taxes & fees
                                                        </Typography>
                                                        <Typography variant="caption" color="success.main">
                                                            Included
                                                        </Typography>
                                                    </Stack>
                                                )}

                                                {nonInclusiveTaxes.length > 0 && (
                                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5, pl: 2 }}>
                                                        <Typography variant="caption" color="warning.main">
                                                            Tax
                                                        </Typography>
                                                        <Typography variant="caption" color="warning.main">
                                                            {currency} {totalNonInclusiveTax.toFixed(2)}
                                                        </Typography>
                                                    </Stack>
                                                )}

                                                {/* ✅ Show individual room total */}
                                                <Stack direction="row" justifyContent="space-between" sx={{ pl: 2, mt: 0.5 }}>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        Room {index + 1} Total:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {currency} {roomTotal.toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    {/* ✅ Grand Total - FIXED */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "success.light", p: 2, borderRadius: 1 }}>
                                        <Typography variant="h6" color="black" fontWeight="bold">
                                            Total Paid
                                        </Typography>
                                        <Typography variant="h6" color="black" fontWeight="bold">
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

                    <Stack direction="row" spacing={2} mt={4} justifyContent="flex-start">
                        <Button component={Link} variant="contained" to="/Bookings">View My Bookings</Button>
                        <Button component={Link} variant="outlined" to="/">Go to Home</Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}
