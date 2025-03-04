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
  convertTimestampToDMYHMS,
  convertTimestampToHMS,
  convertTimestampToTimestampFromDayStart,
  convertTimestampToW,
} from "../../utils/dateTimeConverters";
import ObjectView from "../../components/ObjectView/ObjectView";

const SmokingRoute = ({
  form,
  user,
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
  const oneCigarettePrice = useMemo(() => {
    if (user.cigarettesPackPrice) {
      return (user.cigarettesPackPrice / 20).toFixed(2);
    }
  }, [user]);

  const daysFromStopSmokingStart = useMemo(() => {
    if (user.stopSmokingStart) {
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset();
      const todayStart =
        now -
        timezoneOffset * 60 * 1000 -
        ((now - timezoneOffset * 60 * 1000) % 86400000) +
        timezoneOffset * 60 * 1000;
      return (todayStart - user.stopSmokingStart) / 86400000;
    }
  }, [user]);

  const isInProgramToday = useMemo(() => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const todayStart =
      now -
      timezoneOffset * 60 * 1000 -
      ((now - timezoneOffset * 60 * 1000) % 86400000) +
      timezoneOffset * 60 * 1000;
    if (user.stopSmokingStart && user.stopSmokingFinish) {
      if (
        todayStart >= user.stopSmokingStart &&
        todayStart < user.stopSmokingFinish
      ) {
        return true;
      }
    }
  }, [user]);

  const stopSmokingLength = useMemo(() => {
    if (user.stopSmokingStart && user.stopSmokingFinish) {
      return (user.stopSmokingFinish - user.stopSmokingStart) / 86400000;
    }
  }, [user]);

  const stopSmokingProgram = useMemo(() => {
    let programm = [];
    if (user.stopSmokingStart && user.stopSmokingFinish) {
      for (let i = 0; i < stopSmokingLength; i++) {
        programm.push({
          dayOfProgramm: i + 1,
          dayStartTimestamp: user.stopSmokingStart + i * 86400000,
          limit: Math.ceil(
            user.smokingsCount -
              1 -
              ((user.smokingsCount - 1) / stopSmokingLength) * i
          ),
        });
      }
      return programm;
    }
  }, [user, stopSmokingLength]);

  const limitToday = useMemo(() => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const todayStart =
      now -
      timezoneOffset * 60 * 1000 -
      ((now - timezoneOffset * 60 * 1000) % 86400000) +
      timezoneOffset * 60 * 1000;
    if (isInProgramToday) {
      return stopSmokingProgram.find(
        (day) => day.dayStartTimestamp === todayStart
      ).limit;
    }
  }, [isInProgramToday]);

  const cancelledCigarettes = useMemo(() => {
    if (user.smokedFromStopSmokingStart) {
      return (
        daysFromStopSmokingStart * user.smokingsCount -
        user.smokedFromStopSmokingStart
      );
    }
  }, [daysFromStopSmokingStart, user]);

  const savedMoney = useMemo(() => {
    if (cancelledCigarettes) {
      return Math.floor((cancelledCigarettes * oneCigarettePrice) / 1000);
    }
  }, [cancelledCigarettes, oneCigarettePrice]);

  const savedTime = useMemo(() => {
    if (cancelledCigarettes) {
      return Math.floor((cancelledCigarettes * 3) / 60);
    }
  }, [cancelledCigarettes]);

  const userDataToday = useMemo(() => {
    return userDataLastDays[userDataLastDays.length - 1];
  }, [userDataLastDays]);

  const todaySmokings = useMemo(() => {
    return userDataToday.smokings;
  }, [userDataToday]);

  const smokedToday = useMemo(() => {
    return todaySmokings.length || 0;
  }, [todaySmokings]);

  const smokingsAvailable = useMemo(() => {
    if (limitToday && Number.isInteger(smokedToday)) {
      return limitToday - smokedToday;
    }
  }, [limitToday, smokedToday]);

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

  const lastDaysSmokingsFromYesterdayColors = useMemo(() => {
    if (userDataLastDaysFromYesterday && stopSmokingProgram) {
      return userDataLastDaysFromYesterday.map((day) => {
        console.log(day);
        console.log(user);
        if (
          day.dayStartTimestamp >= user.stopSmokingStart &&
          day.dayStartTimestamp < user.stopSmokingFinish
        ) {
          const programDay = stopSmokingProgram.find(
            (dayOfProgram) =>
              dayOfProgram.dayStartTimestamp === day.dayStartTimestamp
          );
          if (day.smokings.length <= programDay.limit) {
            return "hsl(120, 100%, 35%)";
          } else {
            return "hsl(0, 100%, 50%)";
          }
        } else {
          return "hsl(0, 0%, 50%)";
        }
      });
    }
  }, [user, userDataLastDaysFromYesterday, stopSmokingProgram]);

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
        backgroundColor: lastDaysSmokingsFromYesterdayColors,
      },
    ],
  };

  return (
    <div className={`smoking-route${className ? " " + className : ""}`}>
      <Alert className="mb-3">
        <div>
          Today limit: <b>{limitToday}</b>
        </div>
        <div>
          Smoked today: <b>{smokedToday}</b>
        </div>
        <div>
          Today available: <b>{smokingsAvailable}</b>
        </div>
        <div>
          Сэкономленные на курении деньги: <b>{savedMoney} тыс.руб.</b>
        </div>
        <div>
          Сэкономленные на курении время жизни: <b>{savedTime} час.</b>
        </div>
        <details>
          <summary>details</summary>
          <div>
            Last smoking: {convertTimestampToDMYHMS(user.lastSmokingDate)}
          </div>
          <div>
            Stop smoking start:{" "}
            {convertTimestampToDMYHMS(user.stopSmokingStart)}
          </div>
          <div>
            Stop smoking finish:{" "}
            {convertTimestampToDMYHMS(user.stopSmokingFinish)}
          </div>
          <div>Stop smoking length: {stopSmokingLength}</div>
          <div>
            <ObjectView
              objectData={{ "Stop smoking array ": stopSmokingProgram }}
            />
          </div>
          <div>Today in program: {isInProgramToday ? "true" : "false"}</div>

          <div>Cigarettes pack price: {user.cigarettesPackPrice}</div>
          <div>Smokings count: {user.smokingsCount}</div>
          <div>
            Smoked from stop smoking start to today:{" "}
            {user.smokedFromStopSmokingStart}
          </div>
          <div>One cigarette price: {oneCigarettePrice} rub.</div>
          <div>Days from stopSmokingStart: {daysFromStopSmokingStart}</div>
          <div>Отмененные сигареты: {cancelledCigarettes}</div>
        </details>
      </Alert>

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

      {todaySmokings && (
        <CigarettesPack todaySmokings={todaySmokings} limitToday={limitToday} />
      )}

      <Bar data={barChartData} />

      {/* <Bubble
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
        data={data}
      /> */}
      <div>
        <Button
          onClick={() => {
            onGetUserDataLastDays({
              days: 7,
              weekdays: 4,
            });
          }}
        >
          7 days
        </Button>
        <Button
          onClick={() => {
            onGetUserDataLastDays({
              days: 28,
              weekdays: 4,
            });
          }}
        >
          28 days
        </Button>
      </div>

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

      <hr />
      <h3>weekdaySmokings</h3>
      {userDataByWeekday &&
        userDataByWeekday.map((day, index) => {
          return (
            <div className="one-day">
              <details key={index}>
                <summary>
                  <b>{convertTimestampToDMY(day.dayStartTimestamp)}</b>
                </summary>
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
              </details>
            </div>
          );
        })}
    </div>
  );
};

export default SmokingRoute;
