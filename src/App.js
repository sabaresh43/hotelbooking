import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as React from 'react';
import Home from './Components/MainWebsite/Home';
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { Dashboard } from './Components/Dashboard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ProtectedAdminRoute from './ProtectedAdminRoute';

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/Dashboard/*" element={<ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>} />
        </Routes>
      </Router>
    </LocalizationProvider >
  );
}

export default App;
