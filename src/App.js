import { useContext, useMemo, useState } from "react";
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
import ResponseRoute from "./routes/ResponseRoute/ResponseRoute";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [screen, setScreen] = useState("main");
  const [user, setUser] = useState({
    login: "",
    password: "",
    passwordConfirmation: "",
    errorType: "",
    errorText: "",
    weight: "",
  });
  const [smokings, setSmokings] = useState([]);
  const [weights, setweights] = useState([]);
  const [checkUserAuth, setCheckUserAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isAuthUser, setIsAuthUser] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [geoPosition, setGeoPosition] = useState("geo");
  const [userDataByDays, setUserDataByDays] = useState(null);
  const [chart, setChart] = useState(false);
  const [response, setResponse] = useState(null);

  const todaySmokings = useMemo(() => {
    if (userDataByDays) {
      return userDataByDays[userDataByDays.length - 1].smokings;
    }
    return;
  }, [userDataByDays]);

  const validateAuthForm = () => {
    console.log("Валидация авторизации");
  };

  const validateRegForm = () => {
    console.log("Валидация регистрации");
  };

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
        setScreen("main");
        handleGetUserData();
      });
  };

  const handleCheckUserAuthentication = () => {
    fetch("https://www.d-skills.ru/87_stop_smoking/php/checkauth.php")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.user) {
          setScreen("main");
          handleGetUserData();
        }
        if (json.error) {
          setScreen("authorization");
        }
        setCheckUserAuth(true);
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

  if (!checkUserAuth) {
    handleCheckUserAuthentication();
  }
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

  const getRequest = (requestType, queries) => {
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
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setResponse(json);
      });
  };

  const postRequest = () => {
    fetch(
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
      });
  };

  return (
    <div className="app">
      {/* <span className="material-icons">smoke_free</span> Stop Smoking
      <Button icon="settings" onClick={() => setShowSettings(!showSettings)} /> */}
      {showSettings && (
        <div>
          {/* <Button onClick={() => setScreen("registration")}>Рег</Button> */}
          <Button onClick={() => setScreen("authorization")}>Авт</Button>
          <Button onClick={() => setScreen("main")}>Осн</Button>
          {/* <Button onClick={resetUser}>Reset</Button>
          <Button onClick={handleCheckUserAuthentication}>CheckAuth</Button> */}
          <Button onClick={handleGetUserData}>GetUserData</Button>
          {/* <Button onClick={handleGetGeoPosition}>GetGeo</Button>
          <Button onClick={handleLogOut}>LogOut</Button>
          <Button onClick={createChart}>Chart</Button> */}
          <Button onClick={getRequest}>GET</Button>
          <Button onClick={postRequest}>POST</Button>
          <Button onClick={() => setScreen("response-route")}>Response</Button>
          <Button
            onClick={() => {
              getRequest("auth", { userid: 1 });
            }}
          >
            CheckAuth
          </Button>
          <Button
            onClick={() => {
              getRequest("user", { userid: 1 });
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
        </div>
      )}
      {screen === "response-route" && (
        <ResponseRoute responseData={response}></ResponseRoute>
      )}
      {screen === "authorization" && (
        <>
          <h2>Форма Авторизации</h2>
          <form onSubmit={handleSubmitForm}>
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
            <div>
              <Button type="button">Отмена</Button>
              <Button type="button" onClick={handleAuthenticateUser}>
                Войти
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setScreen("registration");
                }}
              >
                Зарегистрироваться
              </Button>
            </div>
          </form>
        </>
      )}
      {screen === "registration" && (
        <>
          <h2>Форма регистрации</h2>
          <form onSubmit={handleSubmitForm}>
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
            <div>
              <Button type="button">Отмена</Button>
              <Button type="button" onClick={handleRegistrateUser}>
                Регистрация
              </Button>
            </div>
          </form>
        </>
      )}
      {screen === "main" && (
        <>
          {geoPosition && (
            <div>
              <div>latitude : {geoPosition.lat}</div>
              <div>longitude : {geoPosition.long}</div>
            </div>
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
          <h2>Форма регистрации веса</h2>
          <form>
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
            <div>
              <Button type="button">Отмена</Button>
              <Button type="button" onClick={handleSetUserWeight}>
                Отправить
              </Button>
            </div>
          </form>
          <h2>Регистр курения</h2>
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
          {/* a1TimeStampGlobal() {
      return new Date(this.timeStamp);
    },
    a2timeZoneOffsetMs() {
      return new Date(this.timeStamp).getTimezoneOffset() * 60000;
    },
    a3timeStampWithTimezoneOffset: function () {
      return new Date(this.timeStamp - this.timeZoneOffsetMs);
    },
    a4startOfDayGMTinMs() {
      return new Date(this.startOfDayGMTinMs);
    },
    a5startOfDayLocalinMs() {
      return new Date(this.startOfDayLocalinMs);
    },
    a6finishOfDayLocalinMs() {
      return new Date(this.finishOfDayLocalinMs);
    }, */}
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
          <h3>Курение</h3>
          {userDataByDays && (
            <ol>
              {userDataByDays[userDataByDays.length - 1].smokings.map(
                (item) => {
                  return (
                    <li key={item.id}>
                      {item.type} - {item.timestamp} -{" "}
                      {String(new Date(item.timestamp))} -
                      {/* {new Date(item.timestamp * 1000).getTimezoneOffset() *
                      60000}{" "}
                    - */}
                    </li>
                  );
                }
              )}
            </ol>
          )}
        </>
      )}
    </div>
  );
}

export default App;
