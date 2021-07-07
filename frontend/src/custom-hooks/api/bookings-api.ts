import useAxios from "axios-hooks";
import { useCallback, useMemo } from "react";
import { stringifyUrl } from "query-string";
import { snakeCase } from "change-case";
import { useAxiosWithTokenRefresh } from "./auth-api";
import {
  BookingData,
  BookingGetQueryParams,
  BookingPatchData,
  BookingPostData,
  BookingStatusAction,
} from "../../types/bookings";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";
import { changeKeyCase } from "../../utils/parser-utils";
import { DEFAULT_ARRAY } from "../../constants";

export function useGetTotalBookingCount() {
  const [{ data: totalBookingCount = 0, loading }, apiCall] = useAxios<number>(
    {
      url: "/bookings/totalcount",
      method: "get",
    },
    { manual: true },
  );

  const getTotalBookingCount = useCallback(async () => {
    try {
      const { data: totalBookingCount } = await apiCall();

      console.log(`GET /bookings/totalcount success:`, totalBookingCount);

      return totalBookingCount;
    } catch (error) {
      console.log(`GET /bookings/totalcount error:`, error, error?.response);

      return 0;
    }
  }, [apiCall]);

  return { totalBookingCount, loading, getTotalBookingCount };
}

export function useGetPendingBookingCount() {
  const [{ data: pendingCount = 0, loading }, apiCall] =
    useAxiosWithTokenRefresh<number>(
      {
        url: "/bookings/pendingcount",
        method: "get",
      },
      { manual: true },
    );

  const getPendingBookingCount = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: pendingCount } = await apiCall();

        console.log("GET /bookings/pendingcount success:", pendingCount);

        return pendingCount;
      }, "GET /bookings/pendingcount error:")();
    } catch (error) {
      resolveApiError(error);

      return 0;
    }
  }, [apiCall]);

  return { pendingCount, loading, getPendingBookingCount };
}

export function useGetBookings() {
  const [{ data: bookings = DEFAULT_ARRAY, loading }, apiCall] =
    useAxiosWithTokenRefresh<BookingData[]>(
      {
        method: "get",
      },
      { manual: true },
    );

  const getBookings = useCallback(
    async (queryParams?: BookingGetQueryParams) => {
      const url = stringifyUrl(
        {
          url: "/bookings/",
          query: changeKeyCase(snakeCase, queryParams),
        },
        { skipNull: true, skipEmptyString: true },
      );

      try {
        return await errorHandlerWrapper(async () => {
          const { data: bookings = [] } = await apiCall({ url });

          console.log(`GET ${url} success:`, bookings);

          return bookings;
        }, `GET ${url} error:`)();
      } catch (error) {
        resolveApiError(error);

        return [];
      }
    },
    [apiCall],
  );

  return { bookings, loading, getBookings };
}

export function useCreateBookings() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<BookingData[]>(
    {
      url: "/bookings/",
      method: "post",
    },
    { manual: true },
  );

  const createBookings = useMemo(
    () =>
      errorHandlerWrapper(async (bookingPostData: BookingPostData) => {
        console.log("POST /bookings/ data:", bookingPostData);

        const { data: bookings = [] } = await apiCall({
          data: bookingPostData,
        });

        console.log("POST /bookings/ success:", bookings);

        if (bookings.length === 0) {
          throw new Error("No bookings were created.");
        }

        return bookings;
      }, "POST /bookings/ error:"),
    [apiCall],
  );

  return { loading, createBookings };
}

export function useUpdateBookingStatus() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<BookingData[]>(
    {
      method: "patch",
    },
    { manual: true },
  );

  const updateBookingStatus = useMemo(
    () =>
      errorHandlerWrapper(
        async (bookingId: number | string, action: BookingStatusAction) => {
          const url = `/bookings/${bookingId}`;
          const data: BookingPatchData = { action };

          const { data: updatedBookings = [] } = await apiCall({
            url,
            data,
          });

          console.log(`PATCH ${url} success:`, updatedBookings);

          if (updatedBookings.length === 0) {
            throw new Error("No booking statuses were updated.");
          }

          return updatedBookings;
        },
        "PATCH /bookings/:bookingId error:",
      ),
    [apiCall],
  );

  return { updateBookingStatus, loading };
}

export function useDeleteBooking() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<BookingData>(
    {
      method: "delete",
    },
    { manual: true },
  );

  const deleteBooking = useMemo(
    () =>
      errorHandlerWrapper(async (bookingId: number | string) => {
        const url = `/bookings/${bookingId}`;

        const { data: deletedBooking } = await apiCall({
          url,
        });

        console.log(`DELETE ${url} success:`, deletedBooking);

        return deletedBooking;
      }, "DELETE /bookings/:bookingId error:"),
    [apiCall],
  );

  return { deleteBooking, loading };
}
