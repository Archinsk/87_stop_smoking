import React from "react";
import "./RequestRoute.css";

const RequestRoute = ({ responseData, className, children, ...props }) => {
  let response;
  const formatPrimitiveType = (primitiveData) => {
    if (typeof primitiveData === "string") {
      return `'${primitiveData}'`;
    }
    return primitiveData;
  };
  const addTypeClass = (primitiveData) => {
    console.log(primitiveData);
    if (typeof primitiveData === "boolean") {
      return " type-boolean";
    }
    if (typeof primitiveData === "string" && primitiveData.startsWith("'")) {
      return " type-string";
    }
    return "";
  };
  const createKeyValuePair = (data) => {
    let arrayData = [];
    for (let dataKey in data) {
      arrayData.push({
        key: dataKey,
        value: formatPrimitiveType(data[dataKey]),
      });
    }
    return arrayData;
  };

  if (responseData) {
    response = createKeyValuePair(responseData).map((item) => {
      return (
        <div className="property">
          <div className="property-key">{item.key}:</div>
          <div className={"property-value" + addTypeClass(item.value)}>
            {String(item.value)}
          </div>
        </div>
      );
    });
  } else {
    response = "no Response Data";
  }
  return (
    <div
      className={`request-route${className ? " " + className : ""}`}
      {...props}
    >
      {children}
      <div className="response">{response}</div>
    </div>
  );
};

export default RequestRoute;
