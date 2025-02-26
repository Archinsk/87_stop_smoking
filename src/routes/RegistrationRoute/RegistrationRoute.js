import React from "react";
import "./RegistrationRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const RegistrationRoute = ({
  form,
  onChangeLogin,
  onChangePassword,
  onChangePasswordConfirmation,
  onCancelRegistration,
  onRegistrateUser,
  className,
  ...props
}) => {
  return (
    <div
      className={`registration-route${className ? " " + className : ""}`}
      {...props}
    >
      <h2>Регистрация</h2>
      <form className="mb-3">
        <Input
          label="Логин"
          id="registrationLogin"
          onChange={onChangeLogin}
          value={form.login}
        />
        <Input
          label="Пароль"
          id="registrationPassword"
          onChange={onChangePassword}
          value={form.password}
        />
        <Input
          label="Подтверждение пароля"
          id="registrationPasswordConfirmation"
          onChange={onChangePasswordConfirmation}
          value={form.passwordConfirmation}
        />
      </form>
      <div>
        <Button type="button" onClick={onCancelRegistration}>
          Отмена
        </Button>
        <Button type="button" onClick={onRegistrateUser}>
          Регистрация
        </Button>
      </div>
    </div>
  );
};

export default RegistrationRoute;
