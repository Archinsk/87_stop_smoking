import React from "react";
import "./SmokingRoute.css";

const SmokingRoute = ({ className, children, ...props }) => {
  return (
    <div
      className={`smoking-route${className ? " " + className : ""}`}
      {...props}
    >
      <h2>Ввод данных</h2>
      <form className="mb-3">
        <div className="form-group">
          <label htmlFor="authLogin" className="form-label">
            Дата начала бросания
          </label>
          <input
            className="form-control"
            id="authLogin"
            value={user.login}
            onChange={(e) => setUser({ ...user, login: e.target.value })}
          />
          <div id="emailHelp" className="form-text">
            Help text
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="authPassword" className="form-label">
            Дата окончания бросания
          </label>
          <input
            type="password"
            className="form-control"
            id="authPassword"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <div id="emailHelp" className="form-text">
            Help text
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="authPassword" className="form-label">
            Количество выкуриваемых сигарет/стиков в день
          </label>
          <input
            type="password"
            className="form-control"
            id="authPassword"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <div id="emailHelp" className="form-text">
            Help text
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="authPassword" className="form-label">
            Стоимость 1 пачки сигарет/стиков
          </label>
          <input
            type="password"
            className="form-control"
            id="authPassword"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <div id="emailHelp" className="form-text">
            Help text
          </div>
        </div>
      </form>
      <div>
        <Button type="button">Отмена</Button>
        <Button type="button" onClick={handleAuthenticateUser}>
          Войти
        </Button>
        <Button
          type="button"
          onClick={() => {
            setRoute("registration-route");
          }}
        >
          Зарегистрироваться
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
      <Alert className="mb-3">
        {userDataByDays &&
          userDataByDays[userDataByDays.length - 1].smokings.length && (
            <div>
              Last smoking:{" "}
              {String(
                new Date(
                  userDataByDays[
                    userDataByDays.length - 1
                  ].smokings[0].timestamp
                )
              )}
            </div>
          )}
      </Alert>
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
      {todaySmokings && (
        <div className="cigarette-box">
          <div className="d-flex">
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 1 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 2 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 3 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 4 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 5 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 6 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 7 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
          </div>
          <div className="d-flex">
            <div className="hole"></div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 8 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 9 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 10 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 11 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 12 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 13 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="hole"></div>
          </div>
          <div className="d-flex">
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 14 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 15 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 16 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 17 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 18 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 19 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
            <div className="circle-background">
              <div
                className={
                  todaySmokings.length >= 20 ? "circle smoked" : "circle"
                }
              ></div>
            </div>
          </div>
        </div>
      )}

      <Bar data={barChart.config.data} />
      <Bubble options={options} data={data} />
      <Button
        onClick={() => {
          setDaysOfStat(7);
          getUserData();
        }}
      >
        7 days
      </Button>
      <Button
        onClick={() => {
          setDaysOfStat(28);
          getUserData();
        }}
      >
        28 days
      </Button>

      <hr />
      <h3>weekdaySmokings</h3>
      <hr />

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
      {children}
    </div>
  );
};

export default SmokingRoute;
