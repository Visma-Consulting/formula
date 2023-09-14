import { defineMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio } from "@mui/material";
import {useEffect, useState} from "react";
import {defineMessages} from "@formatjs/intl";

const SelectTableRow = ({row, columns, formData, updateData}) => {
  const onChange = (props, value) => {
    if (props.target.checked) {
      updateData(row, value);
    }
  }

  return <TableRow>
    <TableCell align="left" key={`row-${row.enum}`}>{row.title}</TableCell>
    {columns.map((column, index) => (
      <TableCell align="center">
        <Radio size="small" aria-labelledby={`row-${row.enum}`} aria-describedby={`header-${index}`} onChange={(props) => onChange(props, index)} checked={formData === index}/>
      </TableCell>))
    }
  </TableRow>
}

const SelectTable = (props) => {
  const {uiSchema, formData, onChange} = props;
  const config = uiSchema['ui:options'].element;
  const [data, setData] = useState(formData ?? {});
  const {tableColumns = [], tableRows = []} = config;

  const tableHeaders = [<TableCell align="center" key="empty" />, ...tableColumns.map((column, index) => <TableCell align="center" key={`header-${index}`}>{column}</TableCell>)];

  const updateRowData = (row, rowData) => {
    const tempData = {...data};
    tempData[row.enum] = rowData;
    setData(tempData);
  }

  useEffect(() => {
    onChange(data);
  }, [data])

  return (<TableContainer>
    <Table size="small" style={{tableLayout: 'fixed'}}>
      <TableHead>
        <TableRow>
          {tableHeaders}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableRows.map(row => <SelectTableRow row={row} columns={tableColumns} formData={data[row.enum]} updateData={updateRowData} />)}
      </TableBody>
    </Table>
  </TableContainer>);
}

export default ({ config }) => {
  const { tableRows = [], tableColumns = [] } = config;

  const properties = {}
  for (const row of tableRows) {
    properties[row.enum] = {type: 'number'}
  }

  return {
    schema: {
      format: 'table',
      type: 'object',
      properties: properties
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

const validationMessages = defineMessages({
  emptyValue: {
    defaultMessage: `Kaikkiin valintoihin taulukossa "{title}" täytyy vastata`
  }
});

export const validators = {
  required: {
    name: defineMessage({
      defaultMessage: 'Pakollinen valintataulukko'
    }),
    fn: (value, _) => {
      if (value) {
        const keys = Object.keys(value);
        for (const key of keys) {
          if (value[key] === undefined) {
            return validationMessages.emptyValue;
          }
        }
      } else {
        return validationMessages.emptyValue;
      }
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Valintataulukko',
});

export const elementType = 'field';
