import { useContext, useEffect, useMemo, useState } from "react";
import "./App.css";
import Button from "./components/Button/Button";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import AuthRoute from "./routes/AuthRoute/AuthRoute";
import RegistrationRoute from "./routes/RegistrationRoute/RegistrationRoute";
import SmokingRoute from "./routes/SmokingRoute/SmokingRoute";
import WeightRoute from "./routes/WeightRoute/WeightRoute";
import RequestRoute from "./routes/RequestRoute/RequestRoute";
import Alert from "./components/Alert/Alert";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [isInitApp, setIsInitApp] = useState(false);
  const [route, setRoute] = useState("loading-route");
  const defaultGuestRoute = "auth-route";
  const defaultAuthRoute = "smoking-route";
  const [user, setUser] = useState({
    login: "",
    password: "",
    passwordConfirmation: "",
    errorType: "",
    errorText: "",
    weight: "",
    name: "",
    auth: false,
  });
  const [userDataByDays, setUserDataByDays] = useState(null);
  const [smokings, setSmokings] = useState([]);
  const [weights, setweights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [geoPosition, setGeoPosition] = useState("geo");

  const [chart, setChart] = useState(false);
  const [response, setResponse] = useState(null);

  const userDataToday = useMemo(() => {
    if (userDataByDays) {
      return userDataByDays[userDataByDays.length - 1];
    }
    return;
  }, [userDataByDays]);
  const userDataLastDays = useMemo(() => {
    if (userDataByDays) {
      return userDataByDays.filter((day, index) => {
        return index !== userDataByDays.length - 1;
      });
    }
    return;
  }, [userDataByDays]);

  const todaySmokings = useMemo(() => {
    if (userDataByDays) {
      return userDataByDays[userDataByDays.length - 1].smokings;
    }
    return;
  }, [userDataByDays]);
  const lastDaysSmokings = useMemo(() => {
    if (userDataByDays) {
      return userDataByDays
        .filter((day, index) => index !== userDataByDays.length - 1)
        .map((day, index) => day.smokings);
    }
    return;
  }, [userDataByDays]);

  const getRequest = async (requestType, queries) => {
    let url =
      "https://www.d-skills.ru/87_stop_smoking/php/stopsmokingrestapi.php";
    if (requestType) {
      url += "/" + requestType;
    }
    if (queries) {
      url += "?";
      for (let key in queries) {
        url += key + "=" + queries[key] + "&";
      }
      url = url.slice(0, -1);
    }
    const responseBody = await fetch(url)
      .then((response) => response.json())
      .then((json) => {
        return json;
      });
    return responseBody;
  };

  const postRequest = async () => {
    const responseBody = await fetch(
      "https://www.d-skills.ru/87_stop_smoking/php/stopsmokingrestapi.php/smoking",
      {
        method: "POST",
        body: {},
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setResponse(json);
        return json;
      });
    return responseBody;
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      const authResponse = await getRequest("auth", { userid: 1 });
      console.log("auth");
      console.log(authResponse);
      setResponse(authResponse);
      setUser({ ...user, auth: authResponse.auth });
      if (authResponse.auth) {
        setUser({ ...user, name: authResponse.user.name });
        return true;
      } else {
        setUser({ ...user, name: "" });
        return;
      }
    };

    const getUserData = async () => {
      const userDataResponse = await getRequest("user", { userid: 1, days: 7 });
      console.log("user");
      console.log(userDataResponse);
      setResponse(userDataResponse);
      setUserDataByDays(userDataResponse.userDataByDays);
    };

    const initApp = async () => {
      const isAuth = await checkUserAuth();
      if (isAuth) {
        await getUserData();
        setRoute(defaultAuthRoute);
      } else {
        setRoute(defaultGuestRoute);
      }
      setIsInitApp(true);
    };

    if (!isInitApp) {
      initApp();
    }
  }, [isInitApp]);

  const resetUser = () => {
    setUser({
      login: "",
      password: "",
      passwordConfirmation: "",
      errorType: "",
      errorText: "",
      weight: "",
    });
  };
  const handleSubmitForm = (formData) => {
    console.log("form submit");
    console.log(formData);
    /* await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "test-title",
        body: "test-body",
        userId: 1,
      }),
    }); */
  };
  const handleRegistrateUser = () => {
    fetch("https://www.d-skills.ru/87_stop_smoking/php/signup.php", {
      method: "POST",
      body: JSON.stringify({
        login: user.login,
        password: user.password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const handleAuthenticateUser = () => {
    fetch("https://www.d-skills.ru/87_stop_smoking/php/signin.php", {
      method: "POST",
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        timeZoneOffset: new Date().getTimezoneOffset(),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setRoute(defaultAuthRoute);
        handleGetUserData();
      });
  };

  const handleGetUserData = () => {
    fetch(
      "https://www.d-skills.ru/87_stop_smoking/php/getuser.php?userid=1&days=7"
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setSmokings(json.smokings);
        setweights(json.weights);
        setUserDataByDays(json.userDataByDays);
      });
  };

  const handleSetSmoking = (smokingType) => {
    let requestBody = {
      smokingType: smokingType,
    };
    const geo = getGeoPosition();
    if (geo) {
      requestBody.latitude = geo.latitude;
      requestBody.longtitude = geo.longtitude;
    }

    fetch("https://www.d-skills.ru/87_stop_smoking/php/setsmoking.php", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        handleGetUserData();
      });
  };

  const handleSetUserWeight = () => {
    fetch("https://www.d-skills.ru/87_stop_smoking/php/setweight.php", {
      method: "POST",
      body: JSON.stringify({
        weight: user.weight,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const getGeoPosition = () => {
    let geo;
    navigator.geolocation.getCurrentPosition((position) => {
      geo = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    });
    return geo;
  };

  const handleGetGeoPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setGeoPosition("qwe");
      }
    );
  };

  const handleLogOut = () => {
    fetch("https://www.d-skills.ru/87_stop_smoking/php/signout.php")
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const barChart = {
    config: {
      data: {
        labels: [
          "Chrome",
          "Safari",
          "Samsung Internet",
          "Opera",
          "UC Browser",
          "Android",
        ],
        datasets: [
          {
            data: [65, 25, 5, 3, 1, 1],
            backgroundColor: [
              "#6090C0",
              "#6060C0",
              "#9060C0",
              "#C06060",
              "#C08F60",
              "#C0BE60",
            ],
          },
        ],
      },
    },
  };
  const createChart = async () => {
    new Chart(document.getElementById("chart01"), barChart.config);
  };

  return (
    <div className="app">
      {/* <span className="material-icons">smoke_free</span> Stop Smoking
      <Button icon="settings" onClick={() => setShowSettings(!showSettings)} /> */}
      <div className="navbar mb-3">
        <Button onClick={() => setRoute("smoking-route")}>Smoking</Button>
        <Button onClick={() => setRoute("weight-route")}>Weight</Button>
        <Button onClick={() => setRoute("auth-route")}>Auth</Button>
        <Button onClick={() => setRoute("request-route")}>Request</Button>
      </div>
      <Alert className="mb-3">
        <div>User name: {user.name ? user.name : "empty"}</div>
      </Alert>
      {route === "auth-route" && (
        <AuthRoute>
          <h2>Авторизация</h2>
          <form className="mb-3">
            <div className="form-group">
              <label htmlFor="authLogin" className="form-label">
                Логин
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
                Пароль
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
        </AuthRoute>
      )}
      {route === "registration-route" && (
        <RegistrationRoute>
          <h2>Регистрация</h2>
          <form className="mb-3">
            <div className="form-group">
              <label htmlFor="registrationLogin" className="form-label">
                Логин
              </label>
              <input
                className="form-control"
                id="registrationLogin"
                value={user.login}
                onChange={(e) => setUser({ ...user, login: e.target.value })}
              />
              <div id="registrationLoginHelp" className="form-text">
                Help text
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="registrationPassword" className="form-label">
                Пароль
              </label>
              <input
                type="password"
                className="form-control"
                id="registrationPassword"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <div id="registrationPasswordHelp" className="form-text">
                Help text
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="registrationPasswordConfirmation"
                className="form-label"
              >
                Подтверждение пароля
              </label>
              <input
                type="password"
                className="form-control"
                id="registrationPasswordConfirmation"
                value={user.passwordConfirmation}
                onChange={(e) =>
                  setUser({ ...user, passwordConfirmation: e.target.value })
                }
              />
              <div
                id="registrationPasswordConfirmationHelp"
                className="form-text"
              >
                Help text
              </div>
            </div>
          </form>
          <div>
            <Button type="button">Отмена</Button>
            <Button type="button" onClick={handleRegistrateUser}>
              Регистрация
            </Button>
          </div>
        </RegistrationRoute>
      )}
      {route === "smoking-route" && (
        <SmokingRoute>
          {/* <div>
              <div>latitude : {geoPosition.lat}</div>
              <div>longitude : {geoPosition.long}</div>
          </div> */}
          <Alert className="mb-3">
            {userDataByDays && userDataByDays && (
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

          {userDataLastDays &&
            userDataLastDays.map((day, index) => {
              return (
                <>
                  <h2>
                    Today start -{" "}
                    {String(new Date(userDataToday.dayStartTimestamp))}
                  </h2>
                  <div className="one-day">
                    <div>
                      dayStart - {day.dayStartTimestamp} -{" "}
                      {String(new Date(day.dayStartTimestamp))}
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
        </SmokingRoute>
      )}
      {route === "weight-route" && (
        <WeightRoute>
          <h2>Вес</h2>
          <form className="mb-3">
            <div className="form-group">
              <label htmlFor="userWeight" className="form-label">
                Вес
              </label>
              <input
                className="form-control"
                id="userWeight"
                value={user.weight}
                onChange={(e) => setUser({ ...user, weight: e.target.value })}
              />
              <div id="registrationLoginHelp" className="form-text">
                Help text
              </div>
            </div>
          </form>
          <div>
            <Button type="button">Отмена</Button>
            <Button type="button" onClick={handleSetUserWeight}>
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
        </WeightRoute>
      )}
      {route === "request-route" && (
        <RequestRoute responseData={response}>
          <div className="mb-3">
            <Button onClick={getRequest}>GET</Button>
            <Button onClick={postRequest}>POST</Button>
            <Button
              onClick={() => {
                getRequest("auth", { userid: 1 });
              }}
            >
              CheckAuth
            </Button>
            <Button
              onClick={() => {
                getRequest("user", { userid: 1, days: 7 });
              }}
            >
              GetUser
            </Button>
            <Button
              onClick={() => {
                getRequest("logout");
              }}
            >
              LogOut
            </Button>
            <Button
              onClick={() => {
                getRequest("userid");
              }}
            >
              UserId
            </Button>
            <Button onClick={handleGetUserData}>GetUserData</Button>
            {/* <Button onClick={handleGetGeoPosition}>GetGeo</Button> */}
          </div>
        </RequestRoute>
      )}

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
      <div className="alert">Вы не курите ... дней</div> */}
    </div>
  );
}

export default App;
