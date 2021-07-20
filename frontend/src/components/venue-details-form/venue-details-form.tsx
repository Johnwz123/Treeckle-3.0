import { useEffect, useState, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Header, Segment, ButtonProps } from "semantic-ui-react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CATEGORY,
  LABEL,
  TYPE,
  PHONE_NUM_REGEX,
  PLACEHOLDER,
  CAPACITY,
  REQUIRED,
  BOOKING_FORM_FIELDS,
  IC_CONTACT_NUMBER,
  IC_EMAIL,
  IC_NAME,
  NAME,
} from "../../constants";
import FormField from "../form-field";
import VenueDetailsCustomFormFieldsSection from "../venue-details-custom-form-fields-section";
import { FieldType, VenueFormProps } from "../../types/venues";
import { useGetVenueCategories } from "../../custom-hooks/api/venues-api";
import DropdownSelectorFormField from "../dropdown-selector-form-field";
import { sort, deepTrim } from "../../utils/parser-utils";
import HorizontalLayoutContainer from "../horizontal-layout-container";

const schema = yup.object().shape({
  [NAME]: yup.string().trim().required("Please enter a venue name"),
  [CATEGORY]: yup
    .string()
    .trim()
    .required("Please select an existing category or add a new one"),
  [CAPACITY]: yup
    .number()
    .positive("Capacity must be a positive number")
    .integer("Capacity must be an integer")
    .transform((value, originalValue) =>
      typeof originalValue === "string" && originalValue === "" ? null : value,
    )
    .nullable(),
  [IC_NAME]: yup.string().trim().notRequired(),
  [IC_EMAIL]: yup
    .string()
    .trim()
    .email("Input must be a valid email")
    .notRequired(),
  [IC_CONTACT_NUMBER]: yup
    .string()
    .trim()
    .matches(PHONE_NUM_REGEX, "Input must be a valid phone number")
    .notRequired(),
  [BOOKING_FORM_FIELDS]: yup
    .array(
      yup
        .object()
        .shape({
          [TYPE]: yup
            .mixed<FieldType>()
            .oneOf(Object.values(FieldType))
            .required("Please choose a field type"),
          [LABEL]: yup
            .string()
            .trim()
            .required("Please enter a label / question"),
          [PLACEHOLDER]: yup.string().trim().notRequired(),
          [REQUIRED]: yup.boolean().required("An error has occurred"),
        })
        .required(),
    )
    .notRequired(),
});

type Props = {
  onSubmit?: (data: VenueFormProps) => Promise<unknown>;
  defaultValues?: VenueFormProps;
  submitButtonProps: ButtonProps;
};

const defaultFormProps: VenueFormProps = {
  [NAME]: "",
  [CATEGORY]: "",
  [CAPACITY]: "",
  [IC_NAME]: "",
  [IC_EMAIL]: "",
  [IC_CONTACT_NUMBER]: "",
  [BOOKING_FORM_FIELDS]: [],
};

function VenueDetailsForm({
  defaultValues = defaultFormProps,
  onSubmit,
  submitButtonProps,
}: Props) {
  const methods = useForm<VenueFormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit } = methods;
  const { venueCategories, loading, getVenueCategories } =
    useGetVenueCategories();
  const sortedVenueCategories = useMemo(
    () => sort(venueCategories),
    [venueCategories],
  );

  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    getVenueCategories();
  }, [getVenueCategories]);

  const _onSubmit = async (formData: VenueFormProps) => {
    setSubmitting(true);
    await onSubmit?.(deepTrim(formData));

    setSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(_onSubmit)}>
        <Segment.Group raised>
          <Segment>
            <Header as={Form.Field}>
              Venue Details
              <Header.Subheader>
                Please fill in the details for the venue.
              </Header.Subheader>
            </Header>

            <Form.Group widths="equal">
              <FormField required label="Venue Name" name={NAME} autoFocus />

              <DropdownSelectorFormField
                name={CATEGORY}
                label="Category"
                placeholder="Select/add a category"
                required
                search
                allowAdditions
                defaultOptions={sortedVenueCategories}
                loading={loading}
              />

              <FormField
                label="Recommended Capacity"
                name={CAPACITY}
                type="number"
              />
            </Form.Group>

            <Form.Group widths="equal">
              <FormField label="Venue IC Name" name={IC_NAME} />

              <FormField label="Venue IC Email" name={IC_EMAIL} type="email" />

              <FormField
                label="Venue IC Contact Number"
                name={IC_CONTACT_NUMBER}
                type="tel"
              />
            </Form.Group>
          </Segment>

          <Segment>
            <Header as={Form.Field}>
              Custom Booking Form Fields
              <Header.Subheader>
                Please set up the fields for the booking form.
              </Header.Subheader>
            </Header>

            <VenueDetailsCustomFormFieldsSection />
          </Segment>

          <Segment>
            <HorizontalLayoutContainer justify="end">
              <Form.Button
                {...submitButtonProps}
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </HorizontalLayoutContainer>
          </Segment>
        </Segment.Group>
      </Form>
    </FormProvider>
  );
}

export default VenueDetailsForm;
