import React from "react";
import "./AuthRoute.css";

const AuthRoute = ({ className, children, ...props }) => {
  return (
    <div className={`auth-route${className ? " " + className : ""}`} {...props}>
      {children}
    </div>
  );
};

export default AuthRoute;
