import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import { ManageHotelsProvider } from "./ManageHotelsContext";
import HotelDataTable from "./HotelDataTable";
import ViewHotelDetails from "./ViewHotelDetails";

function ManageHotels() {
    return (<Container maxWidth={false} disableGutters>
        <ManageHotelsProvider>
            <Routes>
                <Route index element={<HotelDataTable />} />
                <Route path=":id" element={<ViewHotelDetails />} />
            </Routes>
        </ManageHotelsProvider>
    </Container >);
}

export default ManageHotels;