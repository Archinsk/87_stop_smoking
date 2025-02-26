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
  PointElement,
} from "chart.js";
import { Bar, Bubble } from "react-chartjs-2";
import AuthRoute from "./routes/AuthRoute/AuthRoute";
import RegistrationRoute from "./routes/RegistrationRoute/RegistrationRoute";
import WeightRoute from "./routes/WeightRoute/WeightRoute";
import RequestRoute from "./routes/RequestRoute/RequestRoute";
/* import SmokingRoute from "./routes/SmokingRoute/SmokingRoute"; */
import Alert from "./components/Alert/Alert";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

function App() {
  const [authForm, setAuthForm] = useState({ login: "", password: "" });
  const [regForm, setRegForm] = useState({
    login: "",
    password: "",
    passwordConfirmation: "",
  });
  const [weightForm, setWeightForm] = useState({ weight: "" });
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
  const [daysOfStat, setDaysOfStat] = useState(7);
  const [weekdaysStat, setWeekdaysStat] = useState(4);
  const [weekdaySmokings, setWeekdaySmokings] = useState(null);
  const [smokings, setSmokings] = useState([]);
  const [weights, setweights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [geoPosition, setGeoPosition] = useState("geo");

  const [chart, setChart] = useState(false);
  const [response, setResponse] = useState(null);

  const convertTimestampToTimestampFromDayStart = (timestamp) => {
    return timestamp % 86400000;
  };

  const convertMsFromDayStartToHMS = (ts) => {
    let formatter = new Intl.DateTimeFormat("ru", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    return formatter.format(new Date(ts));
  };

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

  const lastDaysSmokingsCount = useMemo(() => {
    if (lastDaysSmokings) {
      return lastDaysSmokings.map((smokings) => smokings.length);
    }
    return;
  }, [lastDaysSmokings]);

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

  const getUserData = async () => {
    const userDataResponse = await getRequest("user", {
      userid: 1,
      days: daysOfStat,
    });
    console.log("user");
    console.log(userDataResponse);
    setResponse(userDataResponse);
    setUserDataByDays(userDataResponse.userDataByDays);
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
      const userDataResponse = await getRequest("user", {
        userid: 1,
        days: daysOfStat,
        weekdays: weekdaysStat,
      });
      console.log("user");
      console.log(userDataResponse);
      setResponse(userDataResponse);
      setUserDataByDays(userDataResponse.userDataByDays);
      setWeekdaySmokings(userDataResponse.weekdaySmokings);
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
  }, [isInitApp, daysOfStat]);

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
  const createChart = async () => {
    new Chart(document.getElementById("chart01"), barChart.config);
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
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
        <AuthRoute
          form={authForm}
          onChangeLogin={(e) => {
            setAuthForm({ ...authForm, login: e.target.value });
          }}
          onChangePassword={(e) => {
            setAuthForm({ ...authForm, password: e.target.value });
          }}
          onAuthUser={() => {
            console.log("unregistred onAuthUser");
          }}
          onGoToRegistration={() => {
            setRoute("registration-route");
          }}
        />
      )}
      {route === "registration-route" && (
        <RegistrationRoute
          form={regForm}
          onChangeLogin={(e) => {
            setRegForm({ ...regForm, login: e.target.value });
          }}
          onChangePassword={(e) => {
            setRegForm({ ...regForm, password: e.target.value });
          }}
          onChangePasswordConfirmation={(e) => {
            setRegForm({ ...regForm, passwordConfirmation: e.target.value });
          }}
          onCancelRegistration={() => {
            console.log("unregistred onCancelRegistration");
          }}
          onRegistrateUser={() => {
            console.log("unregistred onRegistrateUser");
          }}
        />
      )}
      {route === "weight-route" && (
        <WeightRoute
          form={weightForm}
          weights={weights}
          onChangeWeight={() => {
            console.log("unregistred onChangeWeight");
          }}
          onResetWeight={() => {
            console.log("unregistred onResetWeight");
          }}
          onSetWeight={() => {
            console.log("unregistred onSetWeight");
          }}
        />
      )}
      {route === "request-route" && (
        <RequestRoute
          responseData={response}
          onGetRequest={getRequest}
          onPostRequest={postRequest}
          onCheckAuth={() => {
            getRequest("auth", { userid: 1 });
          }}
          onGetUser={() => {
            getRequest("user", {
              userid: 1,
              days: daysOfStat,
              weekdays: weekdaysStat,
            });
          }}
          onLogout={() => {
            getRequest("logout");
          }}
        />
      )}
      {/* {route === "smoking-route" && <SmokingRoute></SmokingRoute>} */}
    </div>
  );
}

export default App;
