import { Card, Form, Header } from "semantic-ui-react";
import { useForm, FormProvider } from "react-hook-form";
import { BookingFormFieldProps, VenueFormProps } from "../../types/venues";
import PlaceholderWrapper from "../placeholder-wrapper";
import { BOOKING_FORM_FIELDS } from "../../constants";
import CustomFormFieldRenderer from "../custom-form-field-renderer";
import styles from "./venue-booking-display-form.module.scss";

type Props = {
  venueFormProps: VenueFormProps;
};

function VenueBookingDisplayForm({ venueFormProps }: Props) {
  const { name, category, [BOOKING_FORM_FIELDS]: fields = [] } = venueFormProps;
  const methods = useForm<BookingFormFieldProps[]>();

  return (
    <FormProvider {...methods}>
      <Form className={styles.venueBookingForm}>
        <Card className={styles.card} centered raised>
          <Card.Content className={styles.header}>
            <Header textAlign="center">
              {name}
              <Header.Subheader>{category}</Header.Subheader>
            </Header>
          </Card.Content>
          <Card.Content>
            <PlaceholderWrapper
              defaultMessage="No form fields"
              showDefaultMessage={fields.length === 0}
              placeholder
            >
              {fields.map((field, index) => (
                <CustomFormFieldRenderer
                  key={index}
                  inputName={`${index}`}
                  readOnly
                  {...field}
                />
              ))}
            </PlaceholderWrapper>
          </Card.Content>
        </Card>
      </Form>
    </FormProvider>
  );
}

export default VenueBookingDisplayForm;
