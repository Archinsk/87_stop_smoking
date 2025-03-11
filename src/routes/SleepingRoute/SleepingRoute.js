import React, { useMemo, useState } from "react";
import "./SleepingRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import MuiSelect from "../../components/MuiSelect/MuiSelect";
import MuiRadioGroup from "../../components/MuiRadioGroup/MuiRadioGroupt";

const SleepingRoute = ({ onSetSleeping, className }) => {
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      transportType: "offroad",
      carBrand: "ford",
    },
  });
  const onSubmit = (data) => console.log(data);

  const [car, setCar] = useState("ford");
  const tempForm = watch();
  console.log(tempForm);

  return (
    <div className={`sleeping-route${className ? " " + className : ""}`}>
      <h2>Сон</h2>
      {/* <form className="mb-3" onSubmit={handleSubmit(onSubmit)}> */}
      <div>
        <Button>Лечь спать</Button>
        <Button>Проснуться</Button>
        <Button>Ввести вручную</Button>
      </div>
      <div className="d-flex">
        <Input
          label="Начало"
          id="sleepingStartDatetime"
          type="datetime-local"
          {...register("sleepingStartDatetime")}
        />
        <Input
          label="Окончание"
          id="sleepingFinishDatetime"
          type="datetime-local"
          {...register("sleepingFinishDatetime")}
        />

        {/* <input
            label="Начало"
            id="sleepingStartDatetime"
            type="datetime-local"
            {...register("sleepingStartDatetime")}
          />
          <input
            label="Окончание"
            id="sleepingFinishDatetime"
            type="datetime-local"
            {...register("sleepingFinishDatetime")}
          /> */}
      </div>
      {/* <FormControl>
          <InputLabel id="demo-simple-select-label">Products</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value="yellow"
            label="Products"
            {...register("products")}
          >
            <MenuItem value="red">Tomatos</MenuItem>
            <MenuItem value="yellow">Cheese</MenuItem>
            <MenuItem value="green">Qiwi</MenuItem>
          </Select>
        </FormControl> */}
      <MuiRadioGroup
        label="Тип кузова"
        id="transportType"
        control={control}
        items={[
          { label: "Седан", value: "sedan" },
          { label: "Хетчбэк", value: "hatchback" },
          { label: "Универсал", value: "universal", disabled: true },
          { label: "Внедорожник", value: "offroad" },
        ]}
        name="transportType"
      />
      {tempForm.transportType === "hatchback" && (
        <MuiSelect
          label="Марка"
          id="cars"
          control={control}
          items={[
            { label: "Ауди", value: "audi" },
            { label: "Форд", value: "ford" },
            { label: "Мазда", value: "mazda" },
            { label: "Рено", value: "renault", disabled: true },
            { label: "Тойота", value: "toyota" },
          ]}
          name="carBrand"
        />
      )}
      {/* <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          {...register("gender")}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup> */}
      <div>
        <Button>Сбросить</Button>
        <Button type="submit" onClick={onSetSleeping}>
          Сохранить
        </Button>
      </div>
      {/* </form> */}
      <DevTool control={control} />
    </div>
  );
};

export default SleepingRoute;
