import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Container } from '@mui/material';
import hotelService, { trackActivity } from '../../services/hotel.service';
import BookingContext from './BookingContext';

/**
 * PaymentCallback Component
 * 
 * This component handles the callback from payment gateway.
 * 
 * HitPay sends callback with these URL parameters:
 * - status: "completed" | "success" | "failed" | "cancelled"
 * - reference: Payment transaction reference ID
 * - payment_id: Alternative payment ID (some gateways)
 * 
 * Example callback URLs:
 * Success: /?reference=a0636a90-e701-46e5-9ff5-5cd5c5561350&status=completed
 * Failed:  /?reference=a0636a90-e701-46e5-9ff5-5cd5c5561350&status=failed
 * 
 * Flow:
 * 1. Receive payment status from URL params
 * 2. Retrieve booking data from sessionStorage
 * 3. If payment successful, proceed with hotel booking
 * 4. Navigate to success page with booking confirmation
 */
function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { dispatch } = useContext(BookingContext);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('Processing your payment...');

    useEffect(() => {
        const processPaymentCallback = async () => {
            try {
                // ✅ Get payment status from URL params
                // HitPay uses 'status' parameter
                const status = searchParams.get('status');
                
                // ✅ Get payment ID - HitPay uses 'reference' parameter
                // Also check alternative parameter names for compatibility
                const paymentId = searchParams.get('reference') 
                    || searchParams.get('payment_id') 
                    || searchParams.get('reference_number');
                
                console.log('💳 Payment callback received:', { 
                    status, 
                    paymentId,
                    allParams: Object.fromEntries(searchParams.entries())
                });

                // ✅ Retrieve stored booking data
                const pendingBookingStr = sessionStorage.getItem('pendingBooking');
                const paymentReference = sessionStorage.getItem('paymentReference');

                if (!pendingBookingStr) {
                    throw new Error('No pending booking found. Please start booking process again.');
                }

                const { bookingPayload, bookingData } = JSON.parse(pendingBookingStr);

                console.log('📦 Retrieved booking data:', {
                    hasBookingPayload: !!bookingPayload,
                    hasBookingData: !!bookingData,
                    amount: bookingPayload?.payable_amount
                });

                // ✅ Check payment status
                // HitPay sends 'completed' for successful payments
                // Some gateways might send 'success'
                const isPaymentSuccessful = status === 'completed' || status === 'success';

                if (!isPaymentSuccessful) {
                    // Payment failed, cancelled, or pending
                    const statusText = status || 'unknown';
                    console.log(`❌ Payment ${statusText}`);
                    
                    trackActivity("payment_failed", {
                        status: statusText,
                        paymentId
                    }).catch(console.error);
                    
                    setError(`Payment ${statusText}. Please try again.`);
                    setLoading(false);
                    
                    // Redirect to booking page after 3 seconds
                    setTimeout(() => {
                        sessionStorage.removeItem('pendingBooking');
                        sessionStorage.removeItem('paymentReference');
                        navigate('/booking', { 
                            state: { 
                                paymentFailed: true,
                                paymentStatus: statusText
                            } 
                        });
                    }, 3000);
                    return;
                }

                // ✅ Payment successful - proceed with hotel booking
                setMessage('Payment successful! Confirming your booking...');
                console.log('✅ Payment successful, proceeding with booking');

                // Track payment success
                trackActivity("payment_success", {
                    paymentId,
                    amount: bookingPayload.payable_amount
                }).catch(console.error);

                // ✅ Add payment reference to booking payload
                const finalBookingPayload = {
                    ...bookingPayload,
                    payment_reference: paymentId || paymentReference,
                    payment_status: 'completed'
                };

                console.log('📤 Submitting booking:', {
                    hotelId: finalBookingPayload.hotelId,
                    amount: finalBookingPayload.payable_amount,
                    paymentRef: finalBookingPayload.payment_reference
                });

                // ✅ Make booking API call
                const bookingResponse = await hotelService.bookHotel(finalBookingPayload);

                console.log('📥 Booking response:', bookingResponse);

                if (bookingResponse.data.success) {
                    // Track booking success
                    trackActivity("booking_success", {
                        bookingId: bookingResponse.data.data?.BookingId,
                        paymentId
                    }).catch(console.error);

                    // ✅ Update context with confirmation
                    dispatch({
                        type: 'setBookingConfirmation',
                        payload: {
                            data: bookingResponse.data
                        }
                    });

                    dispatch({ type: 'setIsBookingSuccess' });

                    // ✅ Clean up sessionStorage
                    sessionStorage.removeItem('pendingBooking');
                    sessionStorage.removeItem('paymentReference');

                    console.log('✅ Booking created successfully');

                    // ✅ Navigate to success page with all data
                    console.log('✈️ Navigating to success page');
                    
                    navigate("/booking/success", {
                        state: {
                            bookingData: {
                                ...bookingData,
                                confirmation: {
                                    ...bookingResponse.data,
                                    actualTotalPrice: bookingData.actualTotalPrice
                                },
                                paymentId: paymentId || paymentReference
                            }
                        },
                        replace: true
                    });
                } else {
                    throw new Error(bookingResponse.data.message || 'Booking failed');
                }

            } catch (error) {
                console.error('❌ Payment callback error:', error);
                
                trackActivity("booking_failed", {
                    error: error.message
                }).catch(console.error);
                
                const errorMessage = error.response?.data?.message 
                    || error.message 
                    || 'Booking failed after payment';
                
                setError(errorMessage);
                setLoading(false);

                // Redirect to booking page after 5 seconds
                setTimeout(() => {
                    sessionStorage.removeItem('pendingBooking');
                    sessionStorage.removeItem('paymentReference');
                    navigate('/booking', { 
                        state: { 
                            bookingFailed: true, 
                            errorMessage 
                        } 
                    });
                }, 5000);
            }
        };

        processPaymentCallback();
    }, [searchParams, navigate, dispatch]);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: 3
                }}
            >
                {loading ? (
                    <>
                        <CircularProgress size={60} />
                        <Typography variant="h6" textAlign="center">
                            {message}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Please do not close this window or press the back button.
                        </Typography>
                    </>
                ) : (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            {error}
                        </Typography>
                        <Typography variant="body2">
                            Redirecting you back to booking page...
                        </Typography>
                    </Alert>
                )}
            </Box>
        </Container>
    );
}

export default PaymentCallback;