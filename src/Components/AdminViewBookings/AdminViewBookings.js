import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { ViewBookingsProvider } from "./ViewBookingsContext";
import BookingDataTable from "./BookingDataTable";
import AdminViewBookingDetails from "./AdminViewBookingDetails";

function AdminViewBookings() {
    return (<Container maxWidth={false} disableGutters>
        <ViewBookingsProvider>
            <Routes>
                <Route index element={<BookingDataTable />} />
                <Route path=":id" element={<AdminViewBookingDetails />} />
            </Routes>
        </ViewBookingsProvider>
    </Container >);
}

export default AdminViewBookings;