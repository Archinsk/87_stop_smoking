import "./App.css";

function App() {
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
  return (
    <div className="app">
      <span className="material-icons">smoke_free</span> Stop Smoking
      <h2>Форма Авторизации</h2>
      <form onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label htmlFor="authLogin" className="form-label">
            Логин
          </label>
          <input className="form-control" id="authLogin" />
          <div id="emailHelp" className="form-text">
            Help text
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="authPassword" className="form-label">
            Пароль
          </label>
          <input type="password" className="form-control" id="authPassword" />
          <div id="emailHelp" className="form-text">
            Help text
          </div>
        </div>
        <div>
          <button type="button">Отмена</button>
          <button>Войти</button>
        </div>
      </form>
      <h2>Форма регистрации</h2>
      <form onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label htmlFor="registrationLogin" className="form-label">
            Логин
          </label>
          <input className="form-control" id="registrationLogin" />
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
          />
          <div id="registrationPasswordConfirmationHelp" className="form-text">
            Help text
          </div>
        </div>
        <div>
          <button type="button">Отмена</button>
          <button>Регистрация</button>
        </div>
      </form>
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
    </div>
  );
}

export default App;
