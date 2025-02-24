import React from "react";
import "./PrimitivePropertyView.css";

const PrimitivePropertyView = ({ propertyKey, propertyValue }) => {
  let formattedValue = "";
  let valueClassName = "property-value";

  if (typeof propertyValue === "string") {
    formattedValue = `'${propertyValue}'`;
    valueClassName += " type-string";
  }

  if (typeof propertyValue === "boolean") {
    formattedValue = String(propertyValue);
    valueClassName += " type-boolean";
  }

  if (typeof propertyValue === "number") {
    formattedValue = String(propertyValue);
    valueClassName += " type-number";
  }

  if (propertyValue === null) {
    formattedValue = "null";
    valueClassName += " type-null";
  }

  if (typeof propertyValue === "undefined") {
    formattedValue = String(propertyValue);
    valueClassName += " type-undefined";
  }

  return (
    <div className="property">
      <div className="property-key">{propertyKey}:</div>
      <div className={valueClassName}>{formattedValue}</div>
    </div>
  );
};

export default PrimitivePropertyView;
