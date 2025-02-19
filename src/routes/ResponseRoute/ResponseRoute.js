import React from "react";
import "./ResponseRoute.css";

const ResponseRoute = ({ responseData, children, ...props }) => {
  let response;

  const createKeyValuePair = (data) => {
    let arrayData = [];
    for (let dataKey in data) {
      arrayData.push({ key: dataKey, value: data[dataKey] });
    }
    return arrayData;
  };

  if (responseData) {
    response = createKeyValuePair(responseData).map((item) => {
      return (
        <div className="property">
          <div className="property-key">{item.key}:</div>
          <div className="property-value">{item.value}</div>
        </div>
      );
    });
  } else {
    response = "no Response Data";
  }
  return (
    <div className="response-route" {...props}>
      <div className="response">{response}</div>
      {children}
    </div>
  );
};

export default ResponseRoute;
