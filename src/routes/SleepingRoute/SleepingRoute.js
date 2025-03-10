import React from "react";
import "./SleepingRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const SleepingRoute = ({ onSetSleeping, className }) => {
  return (
    <div className={`sleeping-route${className ? " " + className : ""}`}>
      <h2>Сон</h2>
      <form className="mb-3">
        <div>
          <Button type="button">Лечь спать</Button>
          <Button type="button">Проснуться</Button>
          <Button type="button">Ввести вручную</Button>
        </div>
        <div className="d-flex">
          <Input
            label="Начало"
            id="sleepingStartDatetime"
            type="datetime-local"
          />
          <Input
            label="Окончание"
            id="sleepingFinishDatetime"
            type="datetime-local"
          />
        </div>
      </form>
      <div>
        <Button type="button">Сбросить</Button>
        <Button type="button" onClick={onSetSleeping}>
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default SleepingRoute;
