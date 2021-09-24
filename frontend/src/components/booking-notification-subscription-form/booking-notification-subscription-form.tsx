import { useEffect, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { DropdownItemProps, Form, Header } from "semantic-ui-react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { EMAIL, NAME, VENUE_ID } from "../../constants";
import { BookingNotificationSubscriptionPostData } from "../../types/venues";
import { deepTrim, sort } from "../../utils/parser-utils";
import {
  useCreateBookingNotificationSubscription,
  useGetVenues,
} from "../../custom-hooks/api/venues-api";
import FormField from "../form-field";
import DropdownSelectorFormField from "../dropdown-selector-form-field";
import { useAppDispatch } from "../../redux/hooks";
import { resolveApiError } from "../../utils/error-utils";
import styles from "./booking-notification-subscription-form.module.scss";
import { updateBookingNotificationSubscriptionAction } from "../../redux/slices/booking-notification-subscription-slice";

type BookingNotificationSubscriptionFormProps =
  BookingNotificationSubscriptionPostData & {
    [VENUE_ID]: string;
  };

const SCHEMA = yup.object().shape({
  [NAME]: yup.string().trim().required("Please enter a name"),
  [EMAIL]: yup
    .string()
    .trim()
    .email("Input must be a valid email")
    .required("Please enter an email"),
  [VENUE_ID]: yup
    .string()
    .trim()
    .required("Please choose a venue to subscribe to"),
});

const DEFAULT_VALUES: BookingNotificationSubscriptionFormProps = {
  [NAME]: "",
  [EMAIL]: "",
  [VENUE_ID]: "",
};

function BookingNotificationSubscriptionForm() {
  const methods = useForm<BookingNotificationSubscriptionFormProps>({
    resolver: yupResolver<yup.AnyObjectSchema>(SCHEMA),
    defaultValues: DEFAULT_VALUES,
  });
  const { venues, loading, getVenues } = useGetVenues();
  const { createBookingNotificationSubscription, loading: isSubmitting } =
    useCreateBookingNotificationSubscription();
  const dispatch = useAppDispatch();

  const sortedVenueOptions: DropdownItemProps[] = useMemo(
    () =>
      sort(
        venues.map(({ id, venueFormProps: { name } }) => ({
          text: name,
          value: `${id}`,
        })),
        { props: "text" },
      ),
    [venues],
  );

  useEffect(() => {
    getVenues();
  }, [getVenues]);

  const { handleSubmit, reset } = methods;

  const onSubmit = async (
    formData: BookingNotificationSubscriptionFormProps,
  ) => {
    const { venueId, ...data } = deepTrim(formData);

    try {
      const createdBookingNotificationSubscription =
        await createBookingNotificationSubscription(venueId, data);

      toast.success(
        "New booking notification subscription has been created successfully.",
      );

      dispatch(
        updateBookingNotificationSubscriptionAction(
          createdBookingNotificationSubscription,
        ),
      );

      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      resolveApiError(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as={Form.Field}>Add Subscribers</Header>

        <Form.Group className={styles.fieldsContainer} widths="equal">
          <FormField fluid required label="Name" name={NAME} width="4" />
          <FormField
            fluid
            required
            label="Email"
            name={EMAIL}
            type="email"
            width="4"
          />
          <DropdownSelectorFormField
            className={styles.dropdown}
            fluid
            required
            label="Venue"
            name={VENUE_ID}
            width="5"
            loading={loading}
            defaultOptions={sortedVenueOptions}
            search
            placeholder="Choose a venue"
          />
          <Form.Button
            type="submit"
            color="blue"
            content="Subscribe"
            fluid
            width="3"
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </Form.Group>
      </Form>
    </FormProvider>
  );
}

export default BookingNotificationSubscriptionForm;
