import React, { useEffect, useMemo, useState } from "react";
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
  convertTimestampToDatetimeLocal,
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
import { getAverageFromNumbersArray } from "../../utils/math";

const SleepingRoute = ({ sleepingsByDays, onSetSleeping, className }) => {
  const [showForm, setShowForm] = useState(false);

  const sleepingsByDaysNotEmptyDays = useMemo(() => {
    if (sleepingsByDays.length) {
      return sleepingsByDays.filter((day) => {
        return day.events.length;
      });
    }
  }, [sleepingsByDays]);

  const lastSleepingDay = useMemo(() => {
    return sleepingsByDaysNotEmptyDays[sleepingsByDaysNotEmptyDays.length - 1];
  }, [sleepingsByDaysNotEmptyDays]);

  const lastSleeping = useMemo(() => {
    return lastSleepingDay.events[lastSleepingDay.events.length - 1];
  }, [lastSleepingDay]);

  const isLastSleepingStartTimestamp = useMemo(() => {
    return !!lastSleeping.startTimestamp;
  }, [lastSleeping]);

  const isLastSleepingFinishTimestamp = useMemo(() => {
    return !!lastSleeping.finishTimestamp;
  }, [lastSleeping]);

  const isLastDayFinishedSleeping = useMemo(() => {
    return lastSleepingDay.events.some((event) => {
      return event.finishTimestamp;
    });
  }, [lastSleepingDay]);

  const sleepingsByDaysFourWeeks = useMemo(() => {
    if (isLastDayFinishedSleeping) {
      return sleepingsByDays.slice(1);
    } else {
      return sleepingsByDays.slice(0, -1);
    }
  }, [sleepingsByDaysNotEmptyDays, isLastDayFinishedSleeping]);

  const sleepingsLengthByDaysFourWeeks = useMemo(() => {
    return sleepingsByDaysFourWeeks.map((day) => {
      let hours = 0;
      if (day.events.length) {
        day.events.forEach((event) => {
          if (event.finishTimestamp) {
            let trimmedEventForDay = { ...event };
            if (trimmedEventForDay.startTimestamp <= day.dayStartTimestamp) {
              trimmedEventForDay.startTimestamp = day.dayStartTimestamp;
            }
            if (
              trimmedEventForDay.finishTimestamp >
              day.dayStartTimestamp + 86400000
            ) {
              trimmedEventForDay.finishTimestamp =
                day.dayStartTimestamp + 86400000;
            }
            hours += +(
              (trimmedEventForDay.finishTimestamp -
                trimmedEventForDay.startTimestamp) /
              3600000
            ).toFixed(2);
          }
        });
      }
      return {
        dayStartTimestamp: day.dayStartTimestamp,
        date: convertTimestampToDMY(day.dayStartTimestamp),
        sleepingHours: hours,
      };
    });
  }, [sleepingsByDaysFourWeeks]);

  const averageSleepingsLengthByFourWeeks = useMemo(() => {
    return getAverageFromNumbersArray(
      sleepingsLengthByDaysFourWeeks.map((day) => +day.sleepingHours)
    ).toFixed(2);
  }, [sleepingsLengthByDaysFourWeeks]);

  const averageSleepingsLengthByLastWeek = useMemo(() => {
    return getAverageFromNumbersArray(
      sleepingsLengthByDaysFourWeeks.slice(-7).map((day) => +day.sleepingHours)
    ).toFixed(2);
  }, [sleepingsLengthByDaysFourWeeks]);

  const averageSleepingsLengthWorkingDaysByFourWeeks = useMemo(() => {
    return getAverageFromNumbersArray(
      sleepingsLengthByDaysFourWeeks
        .filter((day) => {
          const date = new Date(day.dayStartTimestamp);
          return date.getDay() > 0 && date.getDay() < 6;
        })
        .map((day) => +day.sleepingHours)
    ).toFixed(2);
  }, [sleepingsLengthByDaysFourWeeks]);

  const averageSleepingsLengthWorkingDaysLastWeek = useMemo(() => {
    return getAverageFromNumbersArray(
      sleepingsLengthByDaysFourWeeks
        .slice(-7)
        .filter((day) => {
          const date = new Date(day.dayStartTimestamp);
          return date.getDay() > 0 && date.getDay() < 6;
        })
        .map((day) => +day.sleepingHours)
    ).toFixed(2);
  }, [sleepingsLengthByDaysFourWeeks]);

  const averageSleepingsLengthRestDaysByFourWeeks = useMemo(() => {
    return getAverageFromNumbersArray(
      sleepingsLengthByDaysFourWeeks
        .filter((day) => {
          const date = new Date(day.dayStartTimestamp);
          return date.getDay() === 0 || date.getDay() === 6;
        })
        .map((day) => +day.sleepingHours)
    ).toFixed(2);
  }, [sleepingsLengthByDaysFourWeeks]);

  const averageSleepingsLengthRestDaysLastWeek = useMemo(() => {
    return getAverageFromNumbersArray(
      sleepingsLengthByDaysFourWeeks
        .slice(-7)
        .filter((day) => {
          const date = new Date(day.dayStartTimestamp);
          return date.getDay() === 0 || date.getDay() === 6;
        })
        .map((day) => +day.sleepingHours)
    ).toFixed(2);
  }, [sleepingsLengthByDaysFourWeeks]);

  const { register, control, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      startDatetimeLocal: "",
      finishDatetimeLocal: "",
    },
  });

  useEffect(() => {
    if (isLastSleepingStartTimestamp && !isLastSleepingFinishTimestamp) {
      setValue(
        "startDatetimeLocal",
        convertTimestampToDatetimeLocal(lastSleeping.startTimestamp)
      );
    }
  }, [isLastSleepingStartTimestamp, isLastSleepingFinishTimestamp]);

  const form = watch();

  const onSubmit = (formData) => {
    const requestBody = {};
    if (
      formData.startDatetimeLocal &&
      !(isLastSleepingStartTimestamp && !isLastSleepingFinishTimestamp)
    ) {
      requestBody.startDatetimeLocal = formData.startDatetimeLocal;
    }
    if (formData.finishDatetimeLocal) {
      requestBody.finishDatetimeLocal = formData.finishDatetimeLocal;
    }
    onSetSleeping(requestBody);
    reset();
  };

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
          {`start: ${convertTimestampToDMYHMS(lastSleeping.startTimestamp)}`}
          {lastSleeping.finishTimestamp &&
            `, finish: ${convertTimestampToDMYHMS(lastSleeping.finishTimestamp)}`}
        </div>
        <div>
          Средняя продолжительность сна за 4 недели:{" "}
          <b>{averageSleepingsLengthByFourWeeks}</b>
        </div>
        <div>
          Средняя продолжительность сна последние 7 дней:{" "}
          <b>{averageSleepingsLengthByLastWeek}</b>
        </div>
        <div>
          Средняя продолжительность сна в рабочие дни за 4 недели:{" "}
          <b>{averageSleepingsLengthWorkingDaysByFourWeeks}</b>
        </div>
        <div>
          Средняя продолжительность сна в рабочие дни за последние 7 дней:{" "}
          <b>{averageSleepingsLengthWorkingDaysLastWeek}</b>
        </div>
        <div>
          Средняя продолжительность сна в выходные дни за 4 недели:{" "}
          <b>{averageSleepingsLengthRestDaysByFourWeeks}</b>
        </div>
        <div>
          Средняя продолжительность сна в выходные дни за последние 7 дней:{" "}
          <b>{averageSleepingsLengthRestDaysLastWeek}</b>
        </div>
      </Alert>
      <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex gap-2">
          {!(
            isLastSleepingStartTimestamp && !isLastSleepingFinishTimestamp
          ) && (
            <Button
              onClick={() => {
                console.log("Лечь спать");
                onSetSleeping({
                  startDatetimeLocal: convertTimestampToDatetimeLocal(
                    Date.now()
                  ),
                });
                reset();
                console.log(convertTimestampToDatetimeLocal(Date.now()));
              }}
            >
              Лечь спать
            </Button>
          )}
          {isLastSleepingStartTimestamp && !isLastSleepingFinishTimestamp && (
            <Button
              onClick={() => {
                console.log("Проснуться");
                onSetSleeping({
                  finishDatetimeLocal: convertTimestampToDatetimeLocal(
                    Date.now()
                  ),
                });
                reset();
              }}
            >
              Проснуться
            </Button>
          )}
          <Button
            className="button-square"
            icon="more_horiz"
            onClick={() => {
              setShowForm(!showForm);
            }}
          />
        </div>
        {showForm && (
          <>
            <div className="d-flex gap-2">
              <Input
                label="Начало"
                id="sleepingStartDatetime"
                type="datetime-local"
                disabled={
                  isLastSleepingStartTimestamp && !isLastSleepingFinishTimestamp
                }
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
              {false && (
                <Button
                  onClick={() => {
                    reset();
                  }}
                >
                  Сбросить
                </Button>
              )}
              <Button type="submit" disabled={isDisabledSubmitButton}>
                Сохранить
              </Button>
            </div>
          </>
        )}
      </form>

      {sleepingsLengthByDaysFourWeeks?.length && (
        <Bar
          data={{
            labels: sleepingsLengthByDaysFourWeeks.map((day) => {
              return day.date;
            }),
            datasets: [
              {
                data: sleepingsLengthByDaysFourWeeks.map(
                  (day) => day.sleepingHours
                ),
                backgroundColor: sleepingsLengthByDaysFourWeeks.map((day) => {
                  if (day.sleepingHours < 8) {
                    return "hsl(0, 100%, 50%)";
                  } else {
                    return "hsl(0, 0%, 50%)";
                  }
                }),
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
                          event.finishTimestamp
                            ? convertTimestampToHMS(event.finishTimestamp)
                            : "",
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
