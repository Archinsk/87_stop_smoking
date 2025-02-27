import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Button from "./components/Button/Button";
import AuthRoute from "./routes/AuthRoute/AuthRoute";
import RegistrationRoute from "./routes/RegistrationRoute/RegistrationRoute";
import WeightRoute from "./routes/WeightRoute/WeightRoute";
import RequestRoute from "./routes/RequestRoute/RequestRoute";
import SmokingRoute from "./routes/SmokingRoute/SmokingRoute";
import Alert from "./components/Alert/Alert";
import { getRequest, postRequest } from "./utils/RESTAPI";

function App() {
  const [route, setRoute] = useState("loading-route");
  const defaultGuestRoute = "auth-route";
  const defaultAuthRoute = "smoking-route";
  const [authForm, setAuthForm] = useState({ login: "", password: "" });
  const [regForm, setRegForm] = useState({
    login: "",
    password: "",
    passwordConfirmation: "",
  });
  const [stopSmokingForm, setStopSmokingForm] = useState({
    stopSmokingStart: "",
    stopSmokingFinish: "",
    smokingsCount: "",
    cigarettesPackPrice: "",
  });
  const [weightForm, setWeightForm] = useState({ weight: "" });
  const [responses, setResponses] = useState([]);
  const responsesHistoryLength = 10;
  const url =
    "https://www.d-skills.ru/87_stop_smoking/php/stopsmokingrestapi.php";
  //Убрать при публикации
  const userid = 1;
  const [user, setUser] = useState({
    name: "",
    lastSmokingDate: "",
    stopSmokingStart: "",
    stopSmokingFinish: "",
    smokingsCount: "",
    cigarettesPackPrice: "",
  });
  const [userDataLastDays, setUserDataLastDays] = useState(null);
  const [userDataByWeekday, setUserDataByWeekday] = useState(null);
  //-----------------------------------------------------------------
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

  const userDataLastDaysss = useMemo(() => {
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
    if (userDataLastDaysss) {
      let formatter = new Intl.DateTimeFormat("ru", {
        weekday: "short",
      });
      return userDataLastDaysss.map((day) => {
        return formatter.format(new Date(day.dayStartTimestamp));
      });
    }
    return;
  }, [userDataLastDaysss]);

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

  //----------------------------------------------------------------
  const saveResponse = (response) => {
    if (responses.length === responsesHistoryLength) {
      setResponses([
        ...responses.filter((item, index) => index !== 0 && item),
        response,
      ]);
    } else {
      setResponses([...responses, response]);
    }
  };

  const handleGetRequest = async () => {
    const response = await getRequest(url);
    saveResponse(response);
  };

  const handlePostRequest = async () => {
    const response = await postRequest(url);
    saveResponse(response);
  };

  const handleCheckAuth = async () => {
    const response = await getRequest(url, "auth", { userid });
    saveResponse(response);
    return response;
  };

  const handleLogout = async () => {
    const response = await getRequest(url, "logout");
    saveResponse(response);
  };

  const handleGetUser = async (queriesObject) => {
    const response = await getRequest(url, "user", {
      ...queriesObject,
      userid,
    });
    saveResponse(response);
    return response;
  };

  const handleResetRegistration = () => {
    setRegForm({
      ...regForm,
      login: "",
      password: "",
      passwordConfirmation: "",
    });
  };

  const handleRegistrateUser = async () => {
    const response = await postRequest(url, "user", {
      login: regForm.login,
      password: regForm.password,
    });
    saveResponse(response);
  };

  const handleResetAuth = () => {
    setAuthForm({ ...authForm, login: "", password: "" });
  };

  const handleAuthUser = async () => {
    const response = await postRequest(url, "auth", {
      login: authForm.login,
      password: authForm.password,
      timeZoneOffset: new Date().getTimezoneOffset(),
    });
    saveResponse(response);
  };

  const handleSetWeight = async () => {
    const response = await postRequest(url, "auth", {
      weight: weightForm.weight,
    });
    saveResponse(response);
  };

  useEffect(() => {
    const initApp = async () => {
      const responseUser = await handleCheckAuth();
      console.log(responseUser);

      setUser({ ...user, name: responseUser.user.name });
      if (responseUser.auth) {
        const responseUserData = await handleGetUser({
          days: 7,
          weekdays: 4,
        });
        console.log(responseUserData);
        setUserDataLastDays(responseUserData.lastDays);
        setUserDataByWeekday(responseUserData.byWeekday);
        setRoute(defaultAuthRoute);
      } else {
        setRoute(defaultGuestRoute);
      }
    };
    initApp();
  }, []);

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
        <div>User name: {user?.name || "empty"}</div>
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
          onResetAuth={handleResetAuth}
          onAuthUser={handleAuthUser}
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
          onResetRegistration={handleResetRegistration}
          onRegistrateUser={handleRegistrateUser}
        />
      )}
      {route === "weight-route" && (
        <WeightRoute
          form={weightForm}
          weights={weights}
          onChangeWeight={(e) => {
            setWeightForm({ ...weightForm, weight: e.target.value });
          }}
          onResetWeight={() => {
            setWeightForm({ ...weightForm, weight: "" });
          }}
          onSetWeight={handleSetWeight}
        />
      )}
      {route === "request-route" && (
        <RequestRoute
          responses={responses}
          onGetRequest={handleGetRequest}
          onPostRequest={handlePostRequest}
          onCheckAuth={handleCheckAuth}
          onGetUser={() => {
            handleGetUser({
              days: 7,
              weekdays: 4,
            });
          }}
          onLogout={handleLogout}
          onClearResponses={() => {
            setResponses([]);
          }}
        />
      )}
      {route === "smoking-route" && <SmokingRoute />}
    </div>
  );
}

export default App;
