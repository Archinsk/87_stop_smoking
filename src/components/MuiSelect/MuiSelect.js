import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const MuiSelect = ({ label, id, name, control, items }) => {
  return (
    <FormControl>
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Select labelId={`${id}-label`} id={id} label={label} {...field}>
              {items.length &&
                items.map((item) => {
                  return (
                    <MenuItem
                      key={`${item.label}-${item.value}`}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </MenuItem>
                  );
                })}
            </Select>
          );
        }}
      />
    </FormControl>
  );
};

export default MuiSelect;
