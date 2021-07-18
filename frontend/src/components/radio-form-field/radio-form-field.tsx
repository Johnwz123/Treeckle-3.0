import { ReactNode } from "react";
import { useController } from "react-hook-form";
import { Form, Ref } from "semantic-ui-react";

type Props = {
  className?: string;
  required?: boolean;
  label?: ReactNode;
  errorMsg?: string;
  fieldName: string;
  type: "slider" | "toggle" | "checkbox";
  defaultValue?: boolean;
  readOnly?: boolean;
};

function RadioFormField({
  className,
  required = false,
  label,
  errorMsg,
  fieldName,
  type,
  defaultValue,
  readOnly = false,
}: Props) {
  const {
    field: { onChange, onBlur, value, ref, name },
    fieldState: { error },
  } = useController({ name: fieldName, defaultValue, rules: { required } });

  return (
    <Ref innerRef={ref}>
      <Form.Checkbox
        className={className}
        label={label}
        error={
          error &&
          (errorMsg || error?.message
            ? {
                content: errorMsg ?? error?.message,
                pointing: "right",
              }
            : true)
        }
        required={required}
        onChange={(_, { checked }) => onChange(checked)}
        onBlur={onBlur}
        checked={value}
        slider={type === "slider"}
        toggle={type === "toggle"}
        readOnly={readOnly}
        name={name}
      />
    </Ref>
  );
}

export default RadioFormField;
