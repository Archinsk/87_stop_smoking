import React from "react";
import "./RequestRoute.css";
import PrimitivePropertyView from "../../components/PrimitivePropertyView/PrimitivePropertyView";
import ObjectView from "../../components/ObjectView/ObjectView";

const RequestRoute = ({ responseData, className, children, ...props }) => {
  const mockObject = {
    firstName: "John",
    lastName: "Snow",
    age: 27,
    location: undefined,
    score: null,
    isWarior: true,
  };
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

  const properties = () => {
    let arrFromObj = [];
    for (let dataKey in mockObject) {
      arrFromObj.push({ key: dataKey, value: mockObject[dataKey] });
    }
    console.log(arrFromObj);

    return (
      <div>
        {/* {arrFromObj.map((item) => {
          return propertyView(item);
        })} */}
      </div>
    );
  };
  properties();

  if (responseData) {
    response = createKeyValuePair(responseData).map((item) => {
      return (
        <>
          <div className="property">
            <div className="property-key">{item.key}:</div>
            <div className={"property-value" + addTypeClass(item.value)}>
              {String(item.value)}
            </div>
          </div>
        </>
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
      <div className="response mb-3">{response}</div>
      <ObjectView objectData={mockObject} />
    </div>
  );
};

export default RequestRoute;
