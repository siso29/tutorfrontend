const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export async function initializePayment(bookingId, token) {
  if (!bookingId) {
    throw new Error("A booking ID is required.");
  }

  if (!token) {
    throw new Error("Please log in before making a payment.");
  }

  const response = await fetch(`${API_URL}/api/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Could not start payment."
    );
  }

  if (!data.checkoutUrl) {
    throw new Error("The server did not return a checkout URL.");
  }

  return data;
}

export async function verifyPayment(txRef, token) {
  if (!txRef || !token) {
    throw new Error("A transaction reference and login are required.");
  }

  const response = await fetch(
    `${API_URL}/api/payments/verify/${encodeURIComponent(txRef)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Payment verification failed."
    );
  }

  return data;
}

export const paymentService = {
  initializePayment,
  verifyPayment,
};