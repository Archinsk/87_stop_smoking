import React from "react";
import TableCell from "../TableCell/TableCell";
import TableRow from "../TableRow/TableRow";

const Table = ({ data, className, children, ...props }) => {
  if (data) {
    const rows = data.map((rowData, index) => {
      const cells = rowData.map((cellData, index) => {
        return (
          <TableCell
            tag={cellData.tag}
            key={index}
            colSpan={cellData.colspan}
            rowSpan={cellData.rowspan}
            scope={cellData.scope}
          >
            {cellData.content || cellData}
          </TableCell>
        );
      });
      return (
        <TableRow tag={rowData.tag} key={index}>
          {cells}
        </TableRow>
      );
    });
    return (
      <table className={`table${className ? " " + className : ""}`} {...props}>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  return (
    <table className={`table${className ? " " + className : ""}`} {...props}>
      {children}
    </table>
  );
};

export default Table;
