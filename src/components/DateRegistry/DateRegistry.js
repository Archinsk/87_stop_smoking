import React from "react";

const DateRegistry = ({
  className,
  children,
  type = "button",
  icon,
  ...props
}) => {
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

export default DateRegistry;
