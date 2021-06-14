import clsx from "clsx";
import { useState } from "react";
import { Input, Icon } from "semantic-ui-react";
import styles from "./search-bar.module.scss";

type Props = {
  className?: string;
  onSearchValueChange: (newValue: string) => void;
  fluid?: boolean;
};

function SearchBar({ className, onSearchValueChange, fluid = false }: Props) {
  const [value, setValue] = useState("");

  return (
    <Input
      className={clsx(fluid && styles.fluid, className)}
      icon={
        value ? (
          <Icon
            name="times"
            link
            onClick={() => {
              setValue("");
              onSearchValueChange("");
            }}
          />
        ) : (
          <Icon name="search" />
        )
      }
      iconPosition="left"
      value={value}
      onChange={(_, { value }) => {
        setValue(value);
        onSearchValueChange(value);
      }}
      placeholder="Search..."
    />
  );
}

export default SearchBar;
