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
  convertTimestampToTimestampFromDayStart,
} from "../../utils/sateTimeConverters";

const SmokingRoute = ({
  form,
  lastSmokingDate,
  userDataLastDays,
  userDataByWeekday,
  handleSetSmoking,
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
  const lastDaysWeekday = useMemo(() => {
    if (userDataLastDays) {
      let formatter = new Intl.DateTimeFormat("ru", {
        weekday: "short",
      });
      return userDataLastDays.map((day) => {
        return formatter.format(new Date(day.dayStartTimestamp));
      });
    }
    return;
  }, [userDataLastDays]);

  const weekdaySmokings = useMemo(() => {
    if (userDataLastDays) {
      return [];
    }
    return;
  }, [userDataLastDays]);

  const userDataToday = useMemo(() => {
    if (userDataLastDays) {
      return [];
    }
    return;
  }, [userDataLastDays]);

  const lastDaysSmokingsCount = 21;

  const bubbleChartData = useMemo(() => {
    if (weekdaySmokings) {
      console.log("weekdaySmokings");
      console.log(weekdaySmokings);
      return weekdaySmokings
        .map((day) => {
          console.log("day");
          console.log(day);
          if (day.smokings.length) {
            return day.smokings.map((smoking) => {
              console.log("smoking");
              console.log(smoking);

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
  }, [weekdaySmokings]);

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement
  );

  const barChart = {
    config: {
      data: {
        labels: lastDaysWeekday,
        datasets: [
          {
            data: lastDaysSmokingsCount,
            backgroundColor: ["hsl(0, 0%, 50%)"],
          },
        ],
      },
    },
  };

  const data = bubbleChartData && {
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

  return (
    <div className={`smoking-route${className ? " " + className : ""}`}>
      <Alert className="mb-3">Last smoking: {lastSmokingDate}</Alert>
      <h2>Окончание курения</h2>
      <form className="mb-3">
        <Input
          label="Дата начала бросания"
          id="stopSmokingStart"
          onChange={onChangeStopSmokingStart}
          value={form.login}
        />
        <Input
          label="Дата окончания бросания"
          id="stopSmokingFinish"
          onChange={onChangeStopSmokingFinish}
          value={form.login}
        />
        <Input
          label="Количество выкуриваемых сигарет/стиков в день"
          id="smokingsCount"
          onChange={onChangeSmokingsCount}
          value={form.login}
        />
        <Input
          label="Стоимость 1 пачки сигарет/стиков"
          id="cigarettesPackPrice"
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
            handleSetSmoking("cigarette");
          }}
        >
          Cigarette
        </Button>
        <Button
          type="button"
          onClick={() => {
            handleSetSmoking("stick");
          }}
        >
          Stick
        </Button>
      </div>

      {/* {todaySmokings && (
        <CigarettesPack todaySmokingsCount={todaySmokings.length} />
      )} */}

      {/* <Bar data={barChart.config.data} />

      <Bubble
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
        data={data}
      /> */}

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

      <hr />
      <h3>weekdaySmokings</h3>
      <hr />
      <Table />
      {weekdaySmokings &&
        weekdaySmokings.map((day, index) => {
          return (
            <>
              <div className="one-day">
                <div>
                  <b>
                    dayStart - {day.dayStartTimestamp} -{" "}
                    {String(new Date(day.dayStartTimestamp))}
                  </b>
                </div>
                {day.smokings.map((smoking) => {
                  return (
                    <div key={smoking.id}>
                      {convertMsFromDayStartToHMS(
                        convertTimestampToTimestampFromDayStart(
                          smoking.timestamp
                        )
                      )}{" "}
                      -{" "}
                      {convertTimestampToTimestampFromDayStart(
                        smoking.timestamp
                      )}{" "}
                      - {smoking.type} - {smoking.timestamp} -{" "}
                      {String(new Date(smoking.timestamp))}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      <hr />
      <h3>byDaysSmoking</h3>
      <hr />
      <Table />
      {userDataLastDays &&
        userDataLastDays.map((day, index) => {
          return (
            <>
              <div className="one-day">
                <div>
                  <b>
                    dayStart - {day.dayStartTimestamp} -{" "}
                    {String(new Date(day.dayStartTimestamp))}
                  </b>
                </div>
                {day.smokings.map((smoking) => {
                  return (
                    <div key={smoking.id}>
                      {smoking.type} - {smoking.timestamp} -{" "}
                      {String(new Date(smoking.timestamp))}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      {userDataToday && (
        <div className="one-day">
          <div>
            <b>
              todayDayStart - {userDataToday.dayStartTimestamp} -{" "}
              {String(new Date(userDataToday.dayStartTimestamp))}
            </b>
          </div>
          {userDataToday.smokings.map((smoking) => {
            return (
              <div key={smoking.id}>
                {smoking.type} - {smoking.timestamp} -{" "}
                {String(new Date(smoking.timestamp))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmokingRoute;
