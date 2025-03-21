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
import Table from "../../components/Table/Table";
import {
  convertTimestampToDMY,
  convertTimestampToDMYHMS,
  convertTimestampToHMS,
} from "../../utils/dateTimeConverters";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Alert from "../../components/Alert/Alert";

const SleepingRoute = ({ sleepingsByDays, onSetSleeping, className }) => {
  const { register, control, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      startDatetimeLocal: "",
      finishDatetimeLocal: "",
    },
  });

  const form = watch();

  const onSubmit = (formData) => {
    onSetSleeping(formData);
    reset();
  };

  const sleepingsByDaysFromYesterday = useMemo(() => {
    return sleepingsByDays.slice(0, -1).filter((day) => {
      return day.events.length;
    });
  }, [sleepingsByDays]);

  const sleepingsLengthByDaysFromYesterday = useMemo(() => {
    return sleepingsByDaysFromYesterday.map((day) => {
      let hours = 0;
      if (day.events.length) {
        day.events.forEach((event) => {
          hours += +(
            (event.finishTimestamp - event.startTimestamp) /
            1000 /
            60 /
            60
          ).toFixed(2);
        });
      }
      return {
        date: convertTimestampToDMY(day.dayStartTimestamp),
        sleepingHours: hours,
      };
    });
  }, [sleepingsByDaysFromYesterday]);

  const lastSleeping = useMemo(() => {
    if (sleepingsByDays.length) {
      const notEmptyDays = sleepingsByDays.filter((day) => {
        return day.events.length;
      });
      const lastSleepingDay = notEmptyDays[notEmptyDays.length - 1];
      return lastSleepingDay.events[lastSleepingDay.events.length - 1];
    }
  }, [sleepingsByDays]);

  const isLastSleepingStartTimestamp = useMemo(() => {
    return !!lastSleeping.startTimestamp;
  }, [lastSleeping]);

  const isLastSleepingFinishTimestamp = useMemo(() => {
    return !!lastSleeping.finishTimestamp;
  }, [lastSleeping]);

  const isDisabledSubmitButton = useMemo(() => {
    return (
      (!form.startDatetimeLocal && !form.finishDatetimeLocal) ||
      (isLastSleepingStartTimestamp &&
        isLastSleepingFinishTimestamp &&
        !form.startDatetimeLocal) ||
      (isLastSleepingStartTimestamp &&
        !isLastSleepingFinishTimestamp &&
        !form.finishDatetimeLocal)
    );
  }, [isLastSleepingStartTimestamp, isLastSleepingFinishTimestamp, form]);

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement
  );

  /* const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      transportType: "offroad",
      carBrand: "ford",
    },
  });
  const tempForm = watch();
  console.log(tempForm); */
  return (
    <div className={`sleeping-route${className ? " " + className : ""}`}>
      <h2>Сон</h2>
      <Alert className="mb-3">
        <div>
          Last sleeping:{" "}
          {`start: ${convertTimestampToDMYHMS(lastSleeping.startTimestamp)}, finish: ${convertTimestampToDMYHMS(lastSleeping.finishTimestamp)}`}
        </div>
      </Alert>
      <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
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
            {...register("startDatetimeLocal")}
          />
          <Input
            label="Окончание"
            id="sleepingFinishDatetime"
            type="datetime-local"
            {...register("finishDatetimeLocal")}
          />
        </div>
        {/* <MuiRadioGroup
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
      )} */}
        <div>
          <Button
            onClick={() => {
              reset();
            }}
          >
            Сбросить
          </Button>
          <Button type="submit" disabled={isDisabledSubmitButton}>
            Сохранить
          </Button>
        </div>
      </form>

      {sleepingsLengthByDaysFromYesterday?.length && (
        <Bar
          data={{
            labels: sleepingsLengthByDaysFromYesterday.map((day) => {
              return day.date;
            }),
            datasets: [
              {
                data: sleepingsLengthByDaysFromYesterday.map(
                  (day) => day.sleepingHours
                ),
                backgroundColor: "hsl(0, 0%, 50%)",
              },
            ],
          }}
        />
      )}

      <details>
        <summary>
          <h3 className="d-inline-block">sleepingsByDays</h3>
        </summary>
        {sleepingsByDays &&
          sleepingsByDays.map((day, index) => {
            return (
              <div className="one-day" key={index}>
                <details>
                  <summary>
                    <b>{convertTimestampToDMY(day.dayStartTimestamp)}</b>
                  </summary>
                  <Table
                    data={[
                      [
                        { tag: "th", content: "Начало" },
                        { tag: "th", content: "Окончание" },
                      ],
                      ...day.events.map((event) => {
                        return [
                          convertTimestampToHMS(event.startTimestamp),
                          convertTimestampToHMS(event.finishTimestamp),
                        ];
                      }),
                    ]}
                  />
                </details>
              </div>
            );
          })}
      </details>

      <DevTool control={control} />
    </div>
  );
};

export default SleepingRoute;
