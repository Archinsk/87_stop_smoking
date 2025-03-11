import React from "react";
import "./SleepingRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

const SleepingRoute = ({ onSetSleeping, className }) => {
  const { register, handleSubmit, control } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className={`sleeping-route${className ? " " + className : ""}`}>
      <h2>Сон</h2>
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
        <div>
          <Button>Сбросить</Button>
          <Button type="submit" onClick={onSetSleeping}>
            Сохранить
          </Button>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default SleepingRoute;
