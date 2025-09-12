import { PLACES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const placesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlaces: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PLACES_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    getPlaceDetails: builder.query({
      query: (placeId) => ({
        url: `${PLACES_URL}/${placeId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createPlace: builder.mutation({
      query: () => ({
        url: `${PLACES_URL}`,
        method: "POST",
      }),
      invalidatesTags: ["Place"],
    }),
    updatePlace: builder.mutation({
      query: (data) => ({
        url: `${PLACES_URL}/${data.placeId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Place"],
    }),
    uploadPlaceImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: "POST",
        body: data,
      }),
    }),
    deletePlace: builder.mutation({
      query: (placeId) => ({
        url: `${PLACES_URL}/${placeId}`,
        method: "DELETE",
      }),
      providesTags: ["Place"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PLACES_URL}/${data.placeId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Place"],
    }),
    getTopPlaces: builder.query({
      query: () => `${PLACES_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetPlacesQuery,
  useGetPlaceDetailsQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useUploadPlaceImageMutation,
  useDeletePlaceMutation,
  useCreateReviewMutation,
  useGetTopPlacesQuery,
} = placesApiSlice;
