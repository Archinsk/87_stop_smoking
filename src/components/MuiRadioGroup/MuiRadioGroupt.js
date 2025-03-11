import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const MuiRadioGroup = ({ label, id, name, control, items }) => {
  return (
    <FormControl>
      {label && <FormLabel id={`${id}-label`}>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <RadioGroup
              aria-labelledby={`${id}-label`}
              name={id}
              control
              row
              {...field}
            >
              {items.length &&
                items.map((item) => {
                  return (
                    <FormControlLabel
                      key={`${item.label}-${item.value}`}
                      control={<Radio />}
                      label={item.label}
                      value={item.value}
                      disabled={item.disabled}
                    />
                  );
                })}
            </RadioGroup>
          );
        }}
      />
    </FormControl>
  );
};

export default MuiRadioGroup;
