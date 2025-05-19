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
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Alert from "../../components/Alert/Alert";

const WeightRoute = ({
  form,
  weightsByDays,
  onChangeWeightKilograms,
  onChangeWeightGrams,
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

  const averageWeightsForLastSevenChecks = useMemo(() => {
    let checks = 0;
    let totalWeight = 0;
    if (averageWeightsByNotEmptyDays) {
      if (averageWeightsByNotEmptyDays.length > 7) {
        checks = 7;
        averageWeightsByNotEmptyDays.forEach((day, index) => {
          if (averageWeightsByNotEmptyDays.length - index <= 7) {
            totalWeight += day.averageWeight;
          }
        });
        return (Math.round((totalWeight / checks) * 20) / 20).toFixed(2);
      } else {
        checks = averageWeightsByNotEmptyDays.length;
        averageWeightsByNotEmptyDays.forEach((day) => {
          totalWeight += day.averageWeight;
        });
        return Math.round((totalWeight / checks) * 20) / 20;
      }
    }
  }, [averageWeightsByNotEmptyDays]);

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
    Legend,
    Filler
  );

  return (
    <div className={`weight-route${className ? " " + className : ""}`}>
      <Alert className="mb-3">
        <div>
          Средний вес за последние X взвешиваний:{" "}
          {averageWeightsForLastSevenChecks}
        </div>
      </Alert>
      <h2>Вес</h2>
      <form className="d-block mb-3">
        <div className="">
          <Input
            id="userWeightKilograms"
            className="d-inline-block"
            type="number"
            min="0"
            onChange={onChangeWeightKilograms}
            value={
              !form.weightKilograms && averageWeightsForLastSevenChecks
                ? String(averageWeightsForLastSevenChecks).slice(0, -3)
                : form.weightKilograms
            }
          />
          <span> . </span>
          <Input
            id="userWeightGrams"
            className="d-inline-block"
            type="number"
            min="0"
            step="5"
            onChange={onChangeWeightGrams}
            value={
              !form.weightGrams && averageWeightsForLastSevenChecks
                ? String(averageWeightsForLastSevenChecks).slice(-2)
                : form.weightGrams
            }
          />
        </div>
      </form>
      <div className="d-flex gap-2">
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
          scales: {
            y: {
              min: 0,
              max: 100,
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
              backgroundColor: "hsla(0, 0%, 50%, 0.5)",
              fill: true,
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
