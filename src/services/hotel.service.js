import { useSupplier } from "../helpers/SupplierProvider";
import api from "./api.config";
import { getSupplier } from "../utils/getSupplier";
import bookingres from "../helpers/booking_res.json";
import axios from "axios";
import { get } from "react-hook-form";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const FRAPPE_URL =
  "https://travel-site.m.frappe.cloud/api/method/destiin.destiin.doctype";

const getEmployeeId = () =>
  localStorage.getItem("employeeId") || "HR-EMP-00001";
const getToken = () =>
  localStorage.getItem("token") || "5f9e63e2eb95a8e:352254ca034c0d6";

const SUPPLIER = getSupplier();

// Activity tracking function
export const trackActivity = async (bookingStage) => {
  try {
    const payload = {
      employee_id: getEmployeeId(),
      booking_stage: bookingStage,
    };

    await axios.post(
      `${FRAPPE_URL}.employee_activity.employee_activity.update_activity`,
      payload,
      {
        headers: {
          Authorization: `token ${getToken()}`,
          "Content-Type": "application/json",
          Cookie:
            "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_lang=en",
        },
      }
    );
    console.log("Activity tracked:", bookingStage);
  } catch (error) {
    console.error("Failed to track activity:", error);
  }
};

// Booking status update function
const updateBookingStatus = async (bookingDetails) => {
  try {
    const payload = {
      employee_id: bookingDetails.employee_id || getEmployeeId(),
      // employee_name:
      //   bookingDetails.employee_name ||
      //   localStorage.getItem("employeeName") ||
      //   "Guest User",
      booking_id: bookingDetails.booking_id || "",
      check_in_date: bookingDetails.check_in_date || "",
      check_out_date: bookingDetails.check_out_date || "",
      booking_status: bookingDetails.booking_status || "Pending",
      guest_count: bookingDetails.guest_count || 0,
      hotel_name: bookingDetails.hotel_name || "",
      supplier: bookingDetails.supplier || SUPPLIER,
      room_type: bookingDetails.room_type || "",
      payment_status: bookingDetails.payment_status || "Pending",
      payment_method: bookingDetails.payment_method || "Card",
      total_price: bookingDetails.total_price || 0,
      price: bookingDetails.price || 0,
      currency: bookingDetails.currency || "USD",
    };

    await axios.post(
      `${FRAPPE_URL}.employee_activity.employee_activity.create_booking`,
      payload,
      {
        headers: {
          Authorization: `token ${getToken()}`,
          "Content-Type": "application/json",
          Cookie:
            "full_name=Guest; sid=Guest; system_user=yes; user_id=Guest; user_image=",
        },
      }
    );
    console.log("Booking status updated:", payload);
  } catch (error) {
    console.error("Failed to update booking status:", error);
  }
};

export const hotelService = {
  // Get all hotels
  // Search hotels with filters - will call external supplier POST when configured
  searchHotels: async (options) => {
    // If GO_GLOBAL_URL is configured, POST to it using the payload shape provided
    if (BASE_URL) {
      const payload = {
        country: "IN",
        cityCode: options.cityCode || options.location || "",
        fromDate: options.fromDate || options.from?.format("YYYY-MM-DD"),
        toDate: options.toDate || options.to?.format("YYYY-MM-DD"),
        sort: options.sort || 1,
        currency: options.currency || "EUR",
        occupancy: options.occupancy || [
          { adults: options.numberOfGuest || 2, roomCount: 1 },
        ],
      };
      console.log("payload", payload);

      const response = await api.post(`/hotels/${SUPPLIER}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      // Assume the external API returns an array of hotels in response.data
      return response.data;
    }

    // Fallback to internal search endpoint
    const response = await api.get("/hotels/search", { params: options });
    return response.data;
  },

  // Get hotel by ID
  // Get hotel details by ID with search parameters
  // Get hotel details by ID with search parameters
  getHotelDetails: async (hotelId, searchOptions) => {
    if (BASE_URL) {
      const occupancyPayload = searchOptions.occupancy?.map((occ) => ({
        adults: occ.adults,
        roomCount: occ.roomCount,
        childAges: occ.childAges || [],
      })) || [
        {
          adults: searchOptions.numberOfGuest || 2,
          roomCount: 1,
          childAges: [],
        },
      ];

      const payload = {
        country: "IN",
        fromDate: searchOptions.from || searchOptions.fromDate,
        toDate: searchOptions.to || searchOptions.toDate,
        sort: 1,
        currency: searchOptions.currency || "EUR",
        occupancy: occupancyPayload,
      };

      console.log("Hotel details payload:", payload);
      console.log("Hotel ID:", hotelId);

      // ✅ Correct endpoint with hotelId in the path
      const response = await api.post(
        `/hotels/${SUPPLIER}/${hotelId}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Hotel details response:", response.data);
      return response.data?.data || response.data;
    }
  },

  bookHotel: async (bookingData) => {
    if (BASE_URL) {
      const payload = {
        hotelId: bookingData.hotelId,
        roomCode: bookingData.roomCode,
        fromDate: bookingData.fromDate,
        toDate: bookingData.toDate,
        rooms: bookingData.rooms,
        currency: bookingData.currency || "EUR",
        country: bookingData.country || "IN",
        contact: bookingData.contact,
        payable_amount: bookingData.payable_amount,
        occupancy: bookingData.occupancy,
      };

      console.log("Booking API payload:", payload);

      const response = await api.post(`/hotels/${SUPPLIER}/booking`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Booking API response:", response);

      if (
        response?.data?.BookingId &&
        response.data.BookingStatus?.status === "Confirmed"
      ) {
        updateBookingStatus({
          booking_id: response.data.BookingId,
          check_in_date: bookingData.fromDate,
          check_out_date: bookingData.toDate,
          booking_status: "Success",
          guest_count:
            bookingData.rooms?.reduce(
              (sum, room) => sum + (room.adults || 0),
              0
            ) || 0,
          hotel_name: bookingData.hotelName || "",
          supplier: SUPPLIER,
          room_type:
            bookingData.rooms?.[0]?.roomCode || bookingData.roomCode || "",
          payment_status: "Success",
          payment_method: "Card",
          total_price: bookingData.payable_amount || 0,
          price: bookingData.payable_amount || 0,
          currency: bookingData.currency || "USD",
        }).catch((err) => console.error("Async booking update failed:", err));
      } else {
        updateBookingStatus({
          booking_id: response?.data?.BookingId || "",
          check_in_date: bookingData.fromDate,
          check_out_date: bookingData.toDate,
          booking_status: "Failure",
          guest_count:
            bookingData.rooms?.reduce(
              (sum, room) => sum + (room.adults || 0),
              0
            ) || 0,
          hotel_name: bookingData.hotelName || "",
          supplier: SUPPLIER,
          room_type:
            bookingData.rooms?.[0]?.roomCode || bookingData.roomCode || "",
          payment_status: "Pending",
          payment_method: "Card",
          total_price: bookingData.payable_amount || 0,
          price: bookingData.payable_amount || 0,
          currency: bookingData.currency || "USD",
        }).catch((err) => console.error("Async booking update failed:", err));
      }

      return response;
    }

    let data = {};
    return data;
  },

  // Get booking list by employee ID
  getBookingsByEmployeeId: async (employeeId) => {
    // ✅ HARDCODED RESPONSE FOR TESTING
    const hardcodedResponse = {
      success: true,
      message: [
        {
          employee_id: "HR-EMP-00001",
          employee_name: "John Doe",
          booking_id: "15502615652",
          supplier: "dida",
          check_in_date: "2025-12-21",
          check_out_date: "2025-12-24",
          booking_status: "Success",
          guest_count: 2,
          hotel_name: "The Park Chennai",
          room_type: "Deluxe Room Queen",
          payment_status: "Success",
          payment_method: "Card",
          total_price: 299.07,
          price: 299.07,
          currency: "USD",
        },
        {
          employee_id: "HR-EMP-00001",
          employee_name: "John Doe",
          booking_id: "29763799",
          supplier: "goglobal",
          check_in_date: "2025-11-12",
          check_out_date: "2025-11-23",
          booking_status: "Success",
          guest_count: 1,
          hotel_name: "PRINCESS HOTEL",
          room_type: "Shared Dormitory Mixed Dorm",
          payment_status: "Success",
          payment_method: "Card",
          total_price: 204.0,
          price: 204.0,
          currency: "EUR",
        },
      ],
    };

    console.log("📋 Returning hardcoded bookings:", hardcodedResponse);
    return hardcodedResponse;

    /* // 🔒 COMMENTED OUT - Real API call
    try {
      const response = await axios.get(
        `${FRAPPE_URL}.employee_activity.employee_activity.get_bookings`,
        {
          params: {
            employee_id: employeeId || getEmployeeId(),
          },
          headers: {
            Authorization: `token ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Bookings fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      return { message: [], success: false };
    }
    */
  },

  // Get booking details by booking ID and supplier
  getBookingDetails: async (bookingId, supplier) => {
    try {
      console.log(
        `📄 Fetching booking details for ID: ${bookingId}, Supplier: ${supplier}`
      );

      // Call supplier API
      const response = await axios.get(
        `https://supplier-apis-for-travel-tech.vercel.app/api/hotels/${supplier}/booking/${bookingId}`
      );

      console.log("📥 Supplier API response:", response.data);

      if (!response.data.success) {
        throw new Error("Booking details fetch failed");
      }

      // Normalize the response based on supplier
      let normalizedData = {};

      if (supplier === "dida") {
        const data = response.data.data;
        const ratePlan = data.Hotel?.RatePlanList?.[0] || {};
        const guestList = data.GuestList?.[0]?.GuestInfo || [];

        normalizedData = {
          booking_id: data.BookingID,
          supplier: "dida",
          booking_status: data.Status?.status || "Unknown",
          check_in_date: data.CheckInDate,
          check_out_date: data.CheckOutDate,
          order_date: data.OrderDate,
          num_of_rooms: data.NumOfRooms,
          total_price: data.TotalPrice,
          currency: ratePlan.Currency || "USD",
          hotel_name: data?.HotelName || "",
          hotel_id: data.Hotel?.HotelID,
          city_code: data.Hotel?.Destination?.CityCode,
          room_type: ratePlan.RoomName || "",
          room_name_cn: ratePlan.RoomName_CN || "",
          bed_type: ratePlan.BedType,
          breakfast_type: ratePlan.BreakfastType,
          max_occupancy: ratePlan.MaxOccupancy,
          guest_count: guestList.length,
          guests: guestList.map((g) => ({
            first_name: g.Name?.First,
            last_name: g.Name?.Last,
            is_adult: g.IsAdult,
          })),
          contact: {
            first_name: data.Contact?.Name?.First,
            last_name: data.Contact?.Name?.Last,
            phone: data.Contact?.Phone,
            email: data.Contact?.Email,
          },
          client_reference: data.ClientReference,
          price_list: ratePlan.PriceList || [],
          cancellation_policy: data.Hotel?.CancellationPolicyList || [],
          included_fees: data.Hotel?.IncludedFeeList || [],
          remark: data.Hotel?.Remark || "",
          nights: data.Nights,
        };
      } else if (supplier === "goglobal") {
        const data = response.data.data;
        const roomInfo = data.Rooms?.RoomType?.Room || {};
        const personName = roomInfo.PersonName || {};

        normalizedData = {
          booking_id: data.GoBookingCode,
          supplier: "goglobal",
          go_reference: data.GoReference,
          client_booking_code: data.ClientBookingCode,
          booking_status: data.BookingStatus?.status || "Unknown",
          created_date: data.CreatedDate,
          check_in_date: data.ArrivalDate,
          check_out_date: null, // Calculate from ArrivalDate + Nights
          total_price: parseFloat(data.TotalPrice),
          currency: data.Currency,
          hotel_name: data.HotelName,
          hotel_id: data.HotelId,
          hotel_search_code: data.HotelSearchCode,
          city_code: data.CityCode,
          room_type: roomInfo.Category || data.RoomType || "",
          room_basis: data.RoomBasis,
          cancellation_deadline: data.CancellationDeadline,
          nights: data.Nights,
          guest_count: parseInt(data.Rooms?.RoomType?.Adults || 1),
          guests: [
            {
              first_name: personName.FirstName,
              last_name: personName.LastName,
              title: personName.Title,
              person_id: personName.PersonID,
            },
          ],
          leader: {
            name: data.Leader?.value,
            person_id: data.Leader?.LeaderPersonID,
          },
          nationality: data.Nationality,
          remark: data.Remark || "",
          no_alternative_hotel: data.NoAlternativeHotel,
        };
      }

      return {
        success: true,
        message: normalizedData,
      };
    } catch (error) {
      console.error("❌ Failed to fetch booking details:", error);
      return {
        success: false,
        message: {},
        error: error.message,
      };
    }
  },
};

export default hotelService;
