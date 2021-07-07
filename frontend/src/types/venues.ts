import { BaseData } from "./base";
import {
  CATEGORY,
  FIELD_LABEL,
  FIELD_TYPE,
  PLACEHOLDER_TEXT,
  CAPACITY,
  REQUIRED_FIELD,
  BOOKING_FORM_FIELDS,
  IC_CONTACT_NUMBER,
  IC_EMAIL,
  IC_NAME,
  NAME,
  FORM_FIELD_DATA,
  ORGANIZATION,
  FULL_DETAILS,
  EMAIL,
  VENUE,
} from "../constants";

export type VenueGetQueryParams = {
  [CATEGORY]?: string | null;
  [FULL_DETAILS]?: boolean | string | number | null;
};

export type VenuePostData = {
  [NAME]: string;
  [CATEGORY]: string;
  [CAPACITY]: string | null;
  [IC_NAME]: string;
  [IC_EMAIL]: string;
  [IC_CONTACT_NUMBER]: string;
  [FORM_FIELD_DATA]: BookingFormFieldProps[];
};

export type VenuePutData = VenuePostData;

export type VenueData = BaseData &
  Partial<Omit<VenuePostData, "name">> & {
    [NAME]: string;
    [ORGANIZATION]?: string;
  };

export enum FieldType {
  Text = "TEXT",
  TextArea = "TEXT_AREA",
  Number = "NUMBER",
  Boolean = "BOOLEAN",
}

export type BookingFormFieldProps = {
  [FIELD_TYPE]: FieldType;
  [FIELD_LABEL]: string;
  [PLACEHOLDER_TEXT]: string;
  [REQUIRED_FIELD]: boolean;
};

export type VenueFormProps = {
  [NAME]: string;
  [CATEGORY]: string;
  [CAPACITY]: string;
  [IC_NAME]: string;
  [IC_EMAIL]: string;
  [IC_CONTACT_NUMBER]: string;
  [BOOKING_FORM_FIELDS]?: BookingFormFieldProps[];
};

export type VenueViewProps = BaseData & {
  [ORGANIZATION]: string;
  venueFormProps: VenueFormProps;
};

export type BookingNotificationSubscriptionData = BaseData & {
  [NAME]: string;
  [EMAIL]: string;
  [VENUE]: VenueData;
};

export type BookingNotificationSubscriptionPostData = {
  [NAME]: string;
  [EMAIL]: string;
};
