import axios from "axios";

const HITPAY_BASE_URL = "https://indefatigably-openchain-brandi.ngrok-free.dev/api/hitpay";

// Token, Employee helpers (if needed later)
const getEmployeeId = () =>
  localStorage.getItem("employeeId") || "HR-EMP-00001";
const getToken = () =>
  localStorage.getItem("token") || "92ff0ef8f5fb1b6:54436a5f1092d34";

export const paymentService = {
  // Create Payment
  createPayment: async (paymentData) => {
    try {
      const payload = {
        amount: paymentData.amount,
        email: paymentData.email,
        name: paymentData.name,
        phone: paymentData.phone,
        purpose: paymentData.purpose || "Hotel Booking Payment",
        payment_methods: paymentData.payment_methods || [
          "card",
          "paynow_online",
        ],
      };

      console.log("💳 Payment create payload:", payload);

      const response = await axios.post(
        `${HITPAY_BASE_URL}/create-payment`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("💳 Payment API response:", response.data);

      return {
        success: true,
        message: response.data,
      };
    } catch (error) {
      console.error("❌ Payment creation failed:", error);

      return {
        success: false,
        message: "Failed to create payment",
        error: error.message,
      };
    }
  },

  // Verify Payment
  verifyPayment: async (paymentId) => {
    try {
      console.log("🔍 Verifying payment:", paymentId);

      const response = await axios.get(
        `${HITPAY_BASE_URL}/payment-status/${paymentId}`
      );

      console.log("🔍 Payment verify response:", response.data);

      return {
        success: true,
        message: response.data,
      };
    } catch (error) {
      console.error("❌ Payment verification failed:", error);

      return {
        success: false,
        message: "Failed to verify payment",
        error: error.message,
      };
    }
  },
};

export default paymentService;
