import { defineMessage } from 'react-intl';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';

const defaultValue = '';
const makeTable = (initValues, rows, cols) => {
  return [...Array(rows)]
    .map((_, rowNum) => [...Array(cols)]
      .map((_, colNum) => (initValues[rowNum] && initValues[rowNum][colNum]) || defaultValue));
};

const getTotalRows = ({formData, uiSchema}) => {
  const field = uiSchema['ui:options']?.element || {};
  const { tableRowMinimum = 0 } = field;
  return Math.max(Number(tableRowMinimum), formData?.table?.length || 0);
}

const getTotalColumns = ({uiSchema}) => {
  const field = uiSchema['ui:options'].element || {};
  const { tableColumns = [] } = field;
  return tableColumns.length || 0;
}

function TableField(props) {
  const {
    disabled,
    readonly,
    onChange,
    formData,
    errorSchema,
    uiSchema,
    idSchema,
  } = props;
  const config = uiSchema['ui:options'].element
  const {
    tableAddAllowed = false,
    tableRowMinimum = 0,
    tableRowMaximum = Number.MAX_SAFE_INTEGER,
    useLabel = false,
    tableColumns = [],
    label,
    title,
    description,
  } = config;
  const totalRows = getTotalRows( props );
  const totalCols = getTotalColumns( props );

  const [rev, setRev] = useState(uniqueId());

  const onPropertyChange = (tableData) => {
    onChange(
      { table: tableData },
      errorSchema
    );
    if (totalRows !== tableData.length) { setRev(uniqueId()); }
  };

  const onAddRow = (_) => {
    onPropertyChange(makeTable(tableData, totalRows + 1, totalCols));
  }

  const onRemoveRow = (rowNum) => {
    onPropertyChange(tableData.filter((_, index) => index !== rowNum));
  }

  const tableData = makeTable(formData?.table || [], totalRows, totalCols);

  const tableHeaders = tableColumns.map((columnName, index) => (
    <TableCell key={index}>{columnName['fi']}</TableCell>
  ));

  const tableCells = tableData
    .map((row, rowNum) => (
      <TableRow key={`row-${rowNum}-${rev}`}>
        {
          row
            .map((_, colNum) => (
              <TableCell key={`col-${colNum}`}>
                <TextField
                  style={{width: '100%'}}
                  variant="outlined"
                  size="small"
                  defaultValue={tableData[rowNum][colNum]}
                  disabled={disabled}
                  readOnly={readonly}
                  onChange={(event) => {
                    tableData[rowNum][colNum] = event.target.value || defaultValue;
                    onPropertyChange(tableData);
                  }}
                />
              </TableCell>
            ))
            .concat(
              tableData.length > tableRowMinimum ?
                ( rowNum >= tableRowMinimum ?
                    (
                      <TableCell key={'remove'}>
                        <IconButton
                          onClick={(_) => { onRemoveRow(rowNum); }}
                          disabled={disabled || readonly}
                        ><DeleteIcon/></IconButton>
                      </TableCell>
                    ) :
                    (<TableCell key={'remove'}>&nbsp;</TableCell>)
                ) :
                []
            )
        }
      </TableRow>
    ));

  return (
    <div>
      <Typography variant="subtitle1">{title}</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {tableHeaders}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableCells}
          </TableBody>
        </Table>
      </TableContainer>
      { tableAddAllowed &&
        totalRows < tableRowMaximum &&
        <IconButton
          onClick={onAddRow}
          disabled={disabled || readonly}
          edge="start"
          style={{margin: '5px'}}
        ><AddIcon/></IconButton>
      }
    </div>);
}

export default ({ config }) => {
  return {
    schema: {
      type: 'object',
      properties: {
        table: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    uiSchema: {
      'ui:field': TableField,
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Taulukko',
});

export const elementType = 'field';
