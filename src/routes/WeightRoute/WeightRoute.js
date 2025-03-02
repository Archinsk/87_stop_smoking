import React from "react";
import "./WeightRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {
  convertTimestampToDMY,
  convertTimestampToHMS,
} from "../../utils/dateTimeConverters";
import Table from "../../components/Table/Table";

const WeightRoute = ({
  form,
  weights,
  onChangeWeight,
  onResetWeight,
  onSetWeight,
  className,
}) => {
  return (
    <div className={`weight-route${className ? " " + className : ""}`}>
      <h2>Вес</h2>
      <form className="mb-3">
        <Input
          label="Вес"
          id="userWeight"
          onChange={onChangeWeight}
          value={form.weight}
        />
      </form>
      <div>
        <Button type="button" onClick={onResetWeight}>
          Отмена
        </Button>
        <Button type="button" onClick={onSetWeight}>
          Отправить
        </Button>
      </div>

      <h3>Веса</h3>
      {weights &&
        weights.map((day, index) => {
          return (
            <div className="one-day">
              <div>
                <b>{convertTimestampToDMY(day.dayStartTimestamp)}</b>
              </div>
              <Table
                data={[
                  [
                    { tag: "th", content: "Время" },
                    { tag: "th", content: "Тип" },
                  ],
                  ...day.weights.map((weight) => {
                    return [
                      convertTimestampToHMS(weight.timestamp),
                      weight.weight,
                    ];
                  }),
                ]}
              />
            </div>
          );
        })}
    </div>
  );
};

export default WeightRoute;
