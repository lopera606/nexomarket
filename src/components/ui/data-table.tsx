"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
}

const DataTable = React.forwardRef<
  HTMLTableElement,
  DataTableProps<any>
>(
  (
    {
      columns,
      data,
      className,
      rowClassName,
      headerClassName,
    },
    ref
  ) => {
    return (
      <div className={cn("w-full overflow-x-auto rounded-xl border border-gray-100", className)}>
        <table
          ref={ref}
          className="w-full text-sm"
        >
          <thead>
            <tr
              className={cn(
                "border-b border-gray-100",
                "bg-gray-50",
                headerClassName
              )}
            >
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "px-6 py-3 text-left font-semibold",
                    "text-gray-900",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    "border-b border-gray-100",
                    "hover:bg-gray-50",
                    "transition-colors",
                    rowClassName
                  )}
                >
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        "px-6 py-3",
                        "text-gray-900",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row[column.accessor], row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";

export { DataTable };
export type { Column, DataTableProps };
