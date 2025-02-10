import { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("registration");
  const [user, setUser] = useState({
    login: "",
    password: "",
    passwordConfirmation: "",
    errorType: "",
    errorText: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthUser, setIsAuthUser] = useState(false);

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
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const handleCheckUserAuthentication = () => {
    fetch("https://www.d-skills.ru/87_stop_smoking/php/checkauth.php")
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  return (
    <div className="app">
      <span className="material-icons">smoke_free</span> Stop Smoking
      <div>
        <button onClick={() => setScreen("registration")}>Рег</button>
        <button onClick={() => setScreen("authorization")}>Авт</button>
        <button onClick={() => setScreen("main")}>Осн</button>
        <button onClick={resetUser}>Reset</button>
        <button onClick={handleCheckUserAuthentication}>CheckAuth</button>
      </div>
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
              <button type="button">Отмена</button>
              <button type="button" onClick={handleAuthenticateUser}>
                Войти
              </button>
              <button
                type="button"
                onClick={() => {
                  setScreen("registration");
                }}
              >
                Зарегистрироваться
              </button>
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
              <button type="button">Отмена</button>
              <button type="button" onClick={handleRegistrateUser}>
                Регистрация
              </button>
            </div>
          </form>
        </>
      )}
      {screen === "main" && (
        <>
          <div className="alert">
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
        </>
      )}
    </div>
  );
}

export default App;
