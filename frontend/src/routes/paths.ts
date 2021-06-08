import { EVENT_ID, VENUE_ID } from "../constants";

export const HOME_PATH = "/";
export const DASHBOARD_PATH = "/dashboard";
export const BOOKINGS_PATH = "/bookings";
export const BOOKINGS_CREATION_PATH = "/bookings/create";
export const EVENTS_PATH = "/events";
export const EVENTS_SIGNED_UP_PATH = "/events/signedup";
export const EVENTS_SUBSCRIPTIONS_PATH = "/events/subscriptions";
export const EVENTS_OWN_PATH = "/events/own";
export const EVENTS_CREATION_PATH = "/events/create";
export const EVENTS_SINGLE_VIEW_PATH = `/events/:${EVENT_ID}`;
export const EVENTS_EDIT_PATH = `/events/:${EVENT_ID}/edit`;
export const EVENTS_QR_CODE_PATH = `/events/${EVENT_ID}/qrcode`;
export const ADMIN_BOOKINGS_PATH = "/admin/bookings";
export const ADMIN_VENUES_PATH = "/admin/venues";
export const ADMIN_VENUES_CREATION_PATH = "/admin/venues/create";
export const ADMIN_VENUES_EDIT_PATH = `/admin/venues/:${VENUE_ID}`;
export const ADMIN_USERS_PATH = "/admin/users";
export const ADMIN_USERS_PENDING_REGISTRATION_PATH = "/admin/users/pending";
export const ADMIN_USERS_CREATION_PATH = "/admin/users/create";
export const ADMIN_SETTINGS_PATH = "/admin/settings";
export const PROFILE_PATH = "/profile";
