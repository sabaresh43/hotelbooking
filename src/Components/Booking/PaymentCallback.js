// PaymentCallback.js
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        const handlePaymentCallback = async () => {
            const reference = searchParams.get('reference');
            const status = searchParams.get('status');
            
            console.log('Payment callback received:', { reference, status });

            if (status === 'completed') {
                try {
                    // Retrieve the pending booking data
                    const pendingBooking = localStorage.getItem('pendingBooking');
                    
                    if (pendingBooking) {
                        const bookingData = JSON.parse(pendingBooking);
                        
                        // You might want to verify payment with your backend here
                        // await paymentService.verifyPayment(reference);
                        
                        // Clear pending booking
                        localStorage.removeItem('pendingBooking');
                        
                        // Store payment reference in booking data
                        bookingData.paymentReference = reference;
                        
                        // Redirect to success page with booking data
                        navigate('../success', { 
                            state: { 
                                bookingData,
                                paymentReference: reference
                            },
                            replace: true 
                        });
                    } else {
                        setStatus('error');
                        console.error('No pending booking found');
                    }
                } catch (error) {
                    console.error('Error processing payment callback:', error);
                    setStatus('error');
                }
            } else {
                // Payment failed or was cancelled
                setStatus('failed');
                setTimeout(() => {
                    navigate('../booking', { replace: true });
                }, 3000);
            }
        };

        handlePaymentCallback();
    }, [searchParams, navigate]);

    if (status === 'processing') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Processing your payment...
                </Typography>
            </Box>
        );
    }

    if (status === 'failed') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
                    Payment failed or was cancelled. Redirecting back to booking...
                </Alert>
            </Box>
        );
    }

    if (status === 'error') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
                    Error processing payment. Please contact support.
                </Alert>
            </Box>
        );
    }

    return null;
}

export default PaymentCallback;