import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Home from './Components/MainWebsite/Home';
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { Dashboard } from './Components/Dashboard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ProtectedAdminRoute from './ProtectedAdminRoute';
import { SupplierProvider } from './helpers/SupplierProvider';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {restoreSession} from './features/authSlice';
import { UserViewBookingContextProvider } from './Components/UserViewBooking/UserViewBookingContext';
import Success from './Components/Booking/Success'
    function GlobalRedirectHandler({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let status = params.get('status');

    // fallback: some code put query-like data in the pathname (e.g. "/path&status=completed")
    if (!status && location?.pathname) {
      const parts = location.pathname.split('&');
      const statusPart = parts.find(p => p.startsWith('status='));
      if (statusPart) status = statusPart.split('=')[1];
    }

    console.log('GlobalRedirectHandler location:', location);
    console.log('detected status:', status, 'searchParams:', location.search);
    const localData = JSON.parse(localStorage.getItem('pendingBooking') || '{}');
    console.log('Local pendingBooking data:', localData);

    if (status === 'completed') {
      navigate(`/success`, { replace: true });
    }
    // const status = searchParams.get('status');
    // console.log('GlobalRedirectHandler status:', status);
    // console.log('GlobalRedirectHandler searchParams:', searchParams);
    // console.log('GlobalRedirectHandler location:', location);
    // console.log('GlobalRedirectHandler searchParams:', searchParams);
    
    // if (status === 'completed') {
    //   navigate('/hotel', { replace: true });
    // }
  }, [location, navigate]);

  return children;
}
function App() {
const dispatch = useDispatch();

    // ✅ Restore session on app load
    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SupplierProvider>
        <UserViewBookingContextProvider>
               <Router>
                <GlobalRedirectHandler>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/Dashboard/*" element={<ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>} />
            <Route path="/success" element={<Success />} />
          </Routes>
          </GlobalRedirectHandler>
        </Router>
         </UserViewBookingContextProvider>
      </SupplierProvider>

    </LocalizationProvider >
  );
}

export default App;
