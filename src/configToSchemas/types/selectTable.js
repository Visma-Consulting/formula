import { defineMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import {useState} from "react";

const getRow = (row, columns) => {
  return <TableRow>
    <TableCell align="left" key={row.enum}>{row.title}</TableCell>
    {columns.map(column => <TableCell align="center"><Radio/></TableCell>)}
  </TableRow>
}

const SelectTable = (props) => {
  console.log(props);
  const {uiSchema, formData, onChange} = props;
  const config = uiSchema['ui:options'].element;
  console.log(config);
  const {tableColumns = [], tableRows = []} = config;

  const tableHeaders = [<TableCell align="center" key="empty" />, ...tableColumns.map((column, index) => <TableCell align="center" key={`header-${index}`}>{column}</TableCell>)];

  return (<TableContainer>
    <Table size="small" style={{tableLayout: 'fixed'}}>
      <TableHead>
        <TableRow>
          {tableHeaders}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableRows.map(row => getRow(row, tableColumns))}
      </TableBody>
    </Table>
  </TableContainer>);
}

export default ({ config }) => {
  const { tableRows = [], tableColumns = [] } = config;

  return {
    schema: {
      format: 'table',
      type: 'object',
      elements: [
        {
          ...tableRows.map((row, index) => {return {type: 'number', key: row.enum ?? `${index}`, title: row.title}})
        }
      ]
    },
    uiSchema: {
      'ui:field': SelectTable,
      'ui:options': {
        rows: tableRows,
        columns: tableColumns
      }
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Valintataulukko',
});

export const elementType = 'field';
