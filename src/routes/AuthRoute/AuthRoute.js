import React from "react";
import "./AuthRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const AuthRoute = ({
  form,
  onChangeLogin,
  onChangePassword,
  onResetAuth,
  onAuthUser,
  onGoToRegistration,
  className,
}) => {
  return (
    <div className={`auth-route${className ? " " + className : ""}`}>
      <h2>Авторизация</h2>
      <form className="mb-3">
        <Input
          label="Логин"
          id="authLogin"
          onChange={onChangeLogin}
          value={form.login}
        />
        <Input
          label="Пароль"
          id="authPassword"
          onChange={onChangePassword}
          value={form.password}
        />
      </form>
      <div className="d-flex gap-2">
        <Button type="button" onClick={onResetAuth}>
          Отмена
        </Button>
        <Button type="button" onClick={onAuthUser}>
          Войти
        </Button>
        <Button type="button" onClick={onGoToRegistration}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};

export default AuthRoute;
