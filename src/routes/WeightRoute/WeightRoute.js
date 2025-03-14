import React, { useMemo } from "react";
import "./WeightRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {
  convertTimestampToDMY,
  convertTimestampToHMS,
} from "../../utils/dateTimeConverters";
import Table from "../../components/Table/Table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const WeightRoute = ({
  form,
  weightsByDays,
  onChangeWeight,
  onResetWeight,
  onSetWeight,
  className,
}) => {
  const averageWeightsByNotEmptyDays = useMemo(() => {
    if (weightsByDays) {
      return weightsByDays
        .filter((day) => day.events.length)
        .map((day) => {
          if (day.events.length > 1) {
            return {
              averageWeight: (
                day.events
                  .map((event) => +event.weight)
                  .reduce((a, b) => a + b) / day.events.length
              ).toFixed(2),
              date: convertTimestampToDMY(day.dayStartTimestamp),
            };
          } else {
            return {
              averageWeight: +day.events[0].weight,
              date: convertTimestampToDMY(day.dayStartTimestamp),
            };
          }
        });
    }
  }, [weightsByDays]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [70, 80, 70, 65],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

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
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Chart.js Line Chart",
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
        }}
        data={{
          labels: averageWeightsByNotEmptyDays.map((day) => day.date),
          datasets: [
            {
              label: "Dataset 1",
              data: averageWeightsByNotEmptyDays.map(
                (day) => day.averageWeight
              ),
              borderColor: "hsl(0, 0%, 50%)",
              backgroundColor: "hsl(0, 0%, 95%)",
              fill: "start",
            },
          ],
        }}
      />
      <details>
        <summary>
          <h3 className="d-inline-block">averageWeightsByNotEmptyDays</h3>
        </summary>
        {averageWeightsByNotEmptyDays && (
          <Table
            data={[
              [
                { tag: "th", content: "Дата" },
                { tag: "th", content: "Средний вес" },
              ],
              ...averageWeightsByNotEmptyDays.map((day) => {
                return [day.date, , day.averageWeight];
              }),
            ]}
          />
        )}
      </details>
    </div>
  );
};

export default WeightRoute;
