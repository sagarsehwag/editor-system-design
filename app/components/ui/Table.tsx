'use client';

import React from 'react';

type TableColumn = {
  key: string;
  header: string;
};

export type TableRow = {
  [key: string]: React.ReactNode | Record<string, string> | undefined;
  _rowClassName?: string;
  _cellClassNames?: Record<string, string>;
};

type TableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  className?: string;
  wrapperClassName?: string;
};

export function Table({
  columns,
  rows,
  className = '',
  wrapperClassName,
}: TableProps) {
  const table = (
    <table className={`comparison-table ${className}`.trim()}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const rowClassName = row._rowClassName ?? '';
          const cellClassNames = row._cellClassNames ?? {};
          return (
            <tr key={i} className={rowClassName || undefined}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cellClassNames[col.key] || undefined}
                >
                  {row[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{table}</div>;
  }
  return table;
}
