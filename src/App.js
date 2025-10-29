import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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


function App() {
const dispatch = useDispatch();

    // ✅ Restore session on app load
    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SupplierProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/Dashboard/*" element={<ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>} />
          </Routes>
        </Router>
      </SupplierProvider>

    </LocalizationProvider >
  );
}

export default App;
