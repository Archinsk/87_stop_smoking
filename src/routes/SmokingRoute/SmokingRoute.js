import React, { useMemo } from "react";
import "./SmokingRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import CigarettesPack from "../../components/CigarettesPack/CigarettesPack";
import Alert from "../../components/Alert/Alert";
import { Bar, Bubble } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import Table from "../../components/Table/Table";
import {
  convertMsFromDayStartToHMS,
  convertTimestampToDMY,
  convertTimestampToHMS,
  convertTimestampToTimestampFromDayStart,
  convertTimestampToW,
} from "../../utils/dateTimeConverters";

const SmokingRoute = ({
  form,
  lastSmokingDate,
  userDataLastDays,
  userDataByWeekday,
  onSetSmoking,
  onChangeStopSmokingStart,
  onChangeStopSmokingFinish,
  onChangeSmokingsCount,
  onChangeCigarettesPackPrice,
  onResetForm,
  onUnblockStopSmoking,
  onSetStopSmoking,
  onGetUserDataLastDays,
  className,
}) => {
  const userDataToday = useMemo(() => {
    return userDataLastDays[userDataLastDays.length - 1];
  }, [userDataLastDays]);

  const todaySmokings = useMemo(() => {
    return userDataToday.smokings;
  }, [userDataToday]);

  const userDataLastDaysFromYesterday = useMemo(() => {
    return userDataLastDays.slice(0, -1);
  }, [userDataLastDays]);

  const lastDaysSmokingsFromYesterday = useMemo(() => {
    if (userDataLastDaysFromYesterday) {
      return userDataLastDaysFromYesterday.map((day) => day.smokings);
    }
    return;
  }, [userDataLastDaysFromYesterday]);

  const lastDaysSmokingsFromYesterdayCounts = useMemo(() => {
    if (lastDaysSmokingsFromYesterday) {
      return lastDaysSmokingsFromYesterday.map((smokings) => smokings.length);
    }
    return;
  }, [lastDaysSmokingsFromYesterday]);

  const lastDaysSmokingsFromYesterdayWeekdays = useMemo(() => {
    if (userDataLastDaysFromYesterday) {
      return userDataLastDaysFromYesterday.map((day) => {
        return convertTimestampToW(day.dayStartTimestamp);
      });
    }
  }, [userDataLastDaysFromYesterday]);

  const bubbleChartData = useMemo(() => {
    if (userDataByWeekday) {
      return userDataByWeekday
        .map((day) => {
          if (day.smokings.length) {
            return day.smokings.map((smoking) => {
              return {
                ts: convertTimestampToTimestampFromDayStart(smoking.timestamp),
                time: convertMsFromDayStartToHMS(
                  convertTimestampToTimestampFromDayStart(smoking.timestamp)
                ),
              };
            });
          }
        })
        .filter((item) => item);
    }
  }, [userDataByWeekday]);

  const data = {
    datasets: bubbleChartData.map((day, index) => {
      return {
        label: "Date" + index,
        data: day.map((smoking) => {
          return {
            x: smoking.ts * 0.001,
            y: (index + 1) * 10,
            r: 20,
          };
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      };
    }),
  };

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement
  );

  const barChartData = {
    labels: lastDaysSmokingsFromYesterdayWeekdays,
    datasets: [
      {
        data: lastDaysSmokingsFromYesterdayCounts,
        backgroundColor: ["hsl(0, 0%, 50%)"],
      },
    ],
  };

  return (
    <div className={`smoking-route${className ? " " + className : ""}`}>
      <Alert className="mb-3">Last smoking: {lastSmokingDate}</Alert>
      <h2>Окончание курения</h2>
      <form className="mb-3">
        <Input
          label="Дата начала бросания"
          id="stopSmokingStart"
          type="date"
          onChange={onChangeStopSmokingStart}
          value={form.login}
        />
        <Input
          label="Дата окончания бросания"
          id="stopSmokingFinish"
          type="date"
          onChange={onChangeStopSmokingFinish}
          value={form.login}
        />
        <Input
          label="Количество выкуриваемых сигарет/стиков в день"
          id="smokingsCount"
          type="number"
          onChange={onChangeSmokingsCount}
          value={form.login}
        />
        <Input
          label="Стоимость 1 пачки сигарет/стиков"
          id="cigarettesPackPrice"
          type="number"
          onChange={onChangeCigarettesPackPrice}
          value={form.login}
        />
      </form>
      <div>
        <Button type="button" onClick={onResetForm}>
          Отмена
        </Button>
        <Button type="button" onClick={onSetStopSmoking}>
          Отправить
        </Button>
        <Button type="button" onClick={onSetStopSmoking}>
          Переустановить
        </Button>
      </div>
      {/* <div className="alert">
        Для достижения результата начните фиксировать каждую выкуриваемую
        сигарету и стик в момент начала курения. Рекомендации появятся после
        трех дней ведения сттистики
      </div>
      <div className="alert">
        Рекомендуется исключить курение в период с ... по ...
      </div>
      <div className="alert">
        В течение ... дней выкуривается не более ... сигарет/стиков
      </div>
      <div className="alert">
        Съэкономлено ... рублей на покупке сигарет/стиков, ... минут жизни,
        ранее затрачиваемых на курение
      </div>
      <div className="alert">Вы не курите ... дней</div>

      <div>
        <div>latitude : {geoPosition.lat}</div>
        <div>longitude : {geoPosition.long}</div>
      </div> */}
      <div className="mb-3">
        <Button
          type="button"
          onClick={() => {
            onSetSmoking("cigarette");
          }}
        >
          Cigarette
        </Button>
        <Button
          type="button"
          onClick={() => {
            onSetSmoking("stick");
          }}
        >
          Stick
        </Button>
      </div>

      {todaySmokings && <CigarettesPack todaySmokings={todaySmokings} />}

      <Bar data={barChartData} />

      <Bubble
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
        data={data}
      />
      <div>
        <Button
          onClick={() => {
            onGetUserDataLastDays(7);
          }}
        >
          7 days
        </Button>
        <Button
          onClick={() => {
            onGetUserDataLastDays(28);
          }}
        >
          28 days
        </Button>
      </div>

      <hr />
      <h3>byDaysSmoking</h3>
      {userDataLastDays &&
        userDataLastDays.map((day, index) => {
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
                  ...day.smokings.map((smoking) => {
                    return [
                      convertTimestampToHMS(smoking.timestamp),
                      smoking.type,
                    ];
                  }),
                ]}
              />
            </div>
          );
        })}

      <hr />
      <h3>weekdaySmokings</h3>
      {userDataByWeekday &&
        userDataByWeekday.map((day, index) => {
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
                  ...day.smokings.map((smoking) => {
                    return [
                      convertTimestampToHMS(smoking.timestamp),
                      smoking.type,
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

export default SmokingRoute;
