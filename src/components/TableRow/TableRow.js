import React from "react";

const TableRow = ({ tag, className, children, ...props }) => {
  if (tag === "thead") {
    return (
      <thead
        className={`table-head${className ? " " + className : ""}`}
        {...props}
      >
        {children}
      </thead>
    );
  }
  if (tag === "tfoot") {
    return (
      <tfoot
        className={`table-foot${className ? " " + className : ""}`}
        {...props}
      >
        {children}
      </tfoot>
    );
  }
  return (
    <tr className={`table-row${className ? " " + className : ""}`} {...props}>
      {children}
    </tr>
  );
};

export default TableRow;
