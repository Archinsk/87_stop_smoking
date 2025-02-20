import React from "react";
import "./RequestRoute.css";

const RequestRoute = ({ responseData, children, ...props }) => {
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
    <div className="request-route" {...props}>
      <div>Request Route</div>
      <div className="response">{response}</div>
      {children}
    </div>
  );
};

export default RequestRoute;
