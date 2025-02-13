import React from "react";
import "./Button.css";
import Icon from "../Icon/Icon";

const Button = ({ className, children, type = "button", icon, ...props }) => {
  console.log(children);

  return (
    <button
      className={`button${className ? " " + className : ""}`}
      type={type}
      {...props}
    >
      {icon && (
        <>
          <Icon name={icon} />
          {children && <span>{children}</span>}
        </>
      )}
      {!icon && children}
    </button>
  );
};

export default Button;
