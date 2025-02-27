import React from "react";

const Cigarette = ({
  className,
  children,
  type = "button",
  icon,
  ...props
}) => {
  return (
    <div className="circle-background">
      <div
        className={todaySmokingsCount.length >= 20 ? "circle smoked" : "circle"}
      ></div>
    </div>
  );
};

export default Cigarette;
