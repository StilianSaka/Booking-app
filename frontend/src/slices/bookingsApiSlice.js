import { apiSlice } from "./apiSlice";
import { BOOKINGS_URL, PAYPAL_URL } from "../constants";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (booking) => ({
        url: BOOKINGS_URL,
        method: "POST",
        body: booking,
      }),
    }),
    getBookingDetails: builder.query({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payBooking: builder.mutation({
      query: ({ bookingId, details }) => ({
        url: `${BOOKINGS_URL}/${bookingId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: `${BOOKINGS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getBookings: builder.query({
      query: () => ({
        url: BOOKINGS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverBooking: builder.mutation({
      query: (bookingId) => ({
        url: `${BOOKINGS_URL}/${bookingId}/deliver`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingDetailsQuery,
  usePayBookingMutation,
  useGetPaypalClientIdQuery,
  useGetMyBookingsQuery,
  useGetBookingsQuery,
  useDeliverBookingMutation,
} = bookingApiSlice;
