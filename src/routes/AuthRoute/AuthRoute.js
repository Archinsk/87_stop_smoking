import React from "react";
import "./AuthRoute.css";

const AuthRoute = ({ data, children, ...props }) => {
  return (
    <div className="auth-route" {...props}>
      <div>Auth Route</div>
      <div className="response">{data}</div>
      {children}
    </div>
  );
};

export default AuthRoute;
