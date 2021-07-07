import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/local-storage-utils";
import currentUserReducer, {
  setCurrentUserAction,
} from "./slices/current-user-slice";
import bookingsReducer, { resetBookingsAction } from "./slices/bookings-slice";
import bookingCreationReducer, {
  resetBookingCreationAction,
} from "./slices/booking-creation-slice";
import userCreationReducer, {
  resetUserCreationAction,
} from "./slices/user-creation-slice";
import usersReducer, { resetUsersAction } from "./slices/users-slice";
import userInvitesReducer, {
  resetUserInvitesAction,
} from "./slices/user-invites-slice";
import bookingNotificiationSubscriptionReducer, {
  resetBookingNotificationSubscriptionsAction,
} from "./slices/booking-notification-subscription-slice";
import pendingBookingCountReducer, {
  resetPendingBookingCountAction,
} from "./slices/pending-booking-count-slice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    bookings: bookingsReducer,
    bookingCreation: bookingCreationReducer,
    userCreation: userCreationReducer,
    users: usersReducer,
    userInvites: userInvitesReducer,
    bookingNotificiationSubscriptions: bookingNotificiationSubscriptionReducer,
    pendingBookingCount: pendingBookingCountReducer,
  },
  preloadedState: {
    currentUser: loadFromLocalStorage("user"),
    bookingCreation: loadFromLocalStorage("bookingCreation"),
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const resetReduxState = () => {
  store.dispatch(resetBookingsAction());
  store.dispatch(resetBookingCreationAction());
  store.dispatch(resetUserCreationAction());
  store.dispatch(resetUsersAction());
  store.dispatch(resetUserInvitesAction());
  store.dispatch(resetBookingNotificationSubscriptionsAction());
  store.dispatch(resetPendingBookingCountAction());
  store.dispatch(setCurrentUserAction(null));
};

export default store;
