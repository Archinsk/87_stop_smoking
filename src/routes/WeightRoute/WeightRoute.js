import React from "react";
import "./WeightRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const WeightRoute = ({
  form,
  weights,
  onChangeWeight,
  onResetWeight,
  onSetWeight,
  className,
  ...props
}) => {
  return (
    <div
      className={`weight-route${className ? " " + className : ""}`}
      {...props}
    >
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
      {weights.length && (
        <ul>
          {weights.map((item) => {
            return (
              <li key={item.id}>
                {item.weight} - {String(new Date(item.timestamp))}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WeightRoute;
