import React from "react";
import "./TableCell.css";

const TableCell = ({ tag, className, children, ...props }) => {
  if (tag === "th") {
    return (
      <th
        className={`table-header${className ? " " + className : ""}`}
        {...props}
      >
        {children}
      </th>
    );
  }
  return (
    <td
      className={`table-data-cell${className ? " " + className : ""}`}
      {...props}
    >
      {children}
    </td>
  );
};

export default TableCell;
