import { defineMessage, useIntl } from 'react-intl';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { utils } from '@visma/rjsf-core';
import { FormHelperText } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import { TableFooter } from '@mui/material';
import DeleteIcon from "@material-ui/icons/Delete.js";

const useStyles = makeStyles({
  inputLabelRoot: {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
  },
  inputFormControl: {
    "label + &": {
      marginTop: 0
    }
  }
});

export const calcTypeSign = {
  none: '',
  sum: ' (+)',
  minus: ' (-)',
  multiplication: ' (*)',
  fraction: ' (/)'
}

const tableLabel = defineMessage({
  defaultMessage: '{tableName} sarake {columnName} rivi {row}',
});

const defaultValue = '';

const makeTable = (initValues, rows, cols) => {
  return [...Array(rows)].map((_, rowNum) =>
    [...Array(cols)].map(
      (_, colNum) =>
        (initValues[rowNum] && initValues[rowNum][colNum]) || defaultValue
    )
  );
};

const getTotalRows = ({ formData, uiSchema }) => {
  const field = uiSchema['ui:options']?.element || {};
  const { tableRowMinimum = 0 } = field;
  return Math.max(Number(tableRowMinimum), formData?.table?.length || 0);
};

const getTotalColumns = ({ uiSchema }) => {
  const field = uiSchema['ui:options'].element || {};
  const { calcTableColumns = [] } = field;
  return calcTableColumns.length || 0;
};

const getColumnData = (data, column) => {
  return data.map(row => row[column])
    .filter(val =>  val !== null)
    .map(val => typeof val === 'string' ? val.replace(',', '.') : val)
    .filter(val => !isNaN(Number(val)))
    .map(val => parseFloat(val))
    .filter(val => !isNaN(val));
}

const sanitizeResult = (value) => Number(value)
    .toFixed(2)
    .toString()
    .replace('.', ',');

const calculateResult = (type, data) => {
  if (data.length > 0) {
    switch (type) {
      case 'sum':
        return sanitizeResult(data.reduce((partialSum, next) => partialSum + next));
      case 'multiplication':
        return sanitizeResult(data.reduce((partialSum, next) => partialSum * next));
      case 'minus':
        return sanitizeResult(data.reduce((partialSum, next) => partialSum - next));
      case 'fraction':
        return sanitizeResult(data.reduce((partialSum, next) => partialSum / next));
      default:
        return '';
    }
  }
  return '';
}

function CalcTable(props) {
  const {
    disabled,
    readonly,
    onChange,
    formData,
    errorSchema,
    uiSchema,
    idSchema,
    rawErrors
  } = props;
  const config = uiSchema['ui:options'].element;
  const {
    tableAddAllowed = false,
    tableRowMinimum = 0,
    tableRowMaximum = Number.MAX_SAFE_INTEGER,
    useLabel = false,
    calcTableColumns = [],
    rowTitles = [],
    useRowTitles = false,
    label,
    title,
    description,
    id
  } = config;
  const totalRows = getTotalRows(props);
  const totalCols = getTotalColumns(props);

  const intl = useIntl();
  const [rev, setRev] = useState(uniqueId());

  const classes = useStyles();

  const ariaDescribedby = utils.ariaDescribedBy(idSchema.$id, uiSchema, rawErrors);

  const tableColumns = (ignoreTitleColumn) => {

    const columns = calcTableColumns.map(col =>
      col?.name ? col.name + calcTypeSign[col.calcType] : ""
    );

    if (useRowTitles && !ignoreTitleColumn) {
      columns.unshift("");
    }

    return columns;
  }

  const tableData = makeTable(formData?.table || [], totalRows, totalCols);

  const makeRow = (data, dataIndex, row, tableColumns) => {

    const cells = tableColumns(true).map((_, colNum) => (
        <TableCell key={`col-${colNum}`}>
          <TextField
            id={`${id}-${dataIndex}-${colNum}`}
            style={{ width: '100%' }}
            variant="outlined"
            size="small"
            aria-label={intl.formatMessage(tableLabel,
              {
                tableName: useLabel ? label : title,
                columnName: tableColumns[colNum],
                row: dataIndex + 1
              })
            }
            label={useLabel ? label : title}
            defaultValue={tableData[dataIndex][colNum]}
            disabled={disabled}
            readOnly={readonly}
            onChange={(event) => {
              tableData[dataIndex][colNum] = event.target.value || defaultValue;
              onPropertyChange(tableData);
            }}
            InputProps={{classes: { formControl: classes.inputFormControl}, 'aria-describedby': ariaDescribedby}}
            InputLabelProps={{
              htmlFor: `${id}-${dataIndex}-${colNum}`,
              shrink: false,
              className: classes.inputLabelRoot
            }}
          />
        </TableCell>));

    if (useRowTitles) {
      cells.unshift(<TableCell style={{fontWeight: 'bold'}} align={"right"} key={'cell-' + dataIndex + '-' + '-1'}>
        {(rowTitles.length === 0 || dataIndex > rowTitles.length) ? "" :
          rowTitles[dataIndex]}
      </TableCell>);
    }

    return <TableRow key={`row-${dataIndex}-${rev}`}>
      {cells}
      {
        tableData.length > tableRowMinimum ? (
          dataIndex >= tableRowMinimum ? (
            <TableCell key={'remove'}>
              <IconButton
                aria-label={intl.formatMessage({defaultMessage: 'Poista rivi'})}
                onClick={(_) => {
                  onRemoveRow(dataIndex);
                }}
                disabled={disabled || readonly}
              >
                <DeleteIcon alt={intl.formatMessage({defaultMessage: 'Poista rivi'})} />
              </IconButton>
            </TableCell>
          ) : (
            <TableCell key={'remove'}>&nbsp;</TableCell>
          )
        ) : <></>
      }
    </TableRow>;
  };

  const makeFooter = () => {
    const cells = tableColumns(true).map((_, colNum) =>
      makeFooterCell(colNum));

    if (useRowTitles) {
      cells.unshift(<TableCell/>);
    }

    return <TableFooter>
      <TableRow>
        {cells}
      </TableRow>
    </TableFooter>;
  };

  const makeFooterCell = (colNum) => {

    const column = calcTableColumns[colNum];
    const data = getColumnData(tableData, colNum);

    if (data.length === 0) {
      return <TableCell style={{fontWeight: 'bold'}} align={"right"}>
        {column.calcType !== 'none' ? '= ' : ''}
      </TableCell>;
    }

    return (
      <TableCell style={{fontWeight: 'bold'}} align={"right"} key={`footer-col-${colNum}`}>
        {'= ' + calculateResult(column.calcType, data)}
      </TableCell>
    )
  }

  const options = {
    search: false,
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    sort: false,
    display: false,
    pagination: false,
    selectableRows: 'none',
    customRowRender: (data, dataIndex) => makeRow(data, dataIndex, tableData[dataIndex], tableColumns),
    customTableBodyFooterRender: () => makeFooter(),
    textLabels: {
      body: {
        noMatch: intl.formatMessage({defaultMessage: 'Ei näytettäviä rivejä. Lisää rivi painamalla + -painiketta taulukon alapuolella.'}),
      }
    }
  };

  const onAddRow = (_) => {
    onPropertyChange(makeTable(tableData, totalRows + 1, totalCols));
  };

  const onRemoveRow = (rowNum) => {
    onPropertyChange(tableData.filter((_, index) => index !== rowNum));
  };

  const onPropertyChange = (tableData) => {
    const resultRow = calcTableColumns.map((column, index) => calculateResult(column.calcType, getColumnData(tableData, index)));
    onChange({ table: tableData, resultRow: resultRow }, errorSchema);
    if (totalRows !== tableData.length) {
      setRev(uniqueId());
    }
  };

  return (
    <div>
      <MUIDataTable
        data={tableData}
        columns={tableColumns()}
        options={options}
      />
      {tableAddAllowed && totalRows < tableRowMaximum && (
        <IconButton
          aria-label={intl.formatMessage({defaultMessage: 'Lisää rivi'})}
          onClick={onAddRow}
          disabled={disabled || readonly}
          edge="start"
          style={{ margin: '5px' }}
        >
          <AddIcon alt={intl.formatMessage({defaultMessage: 'Lisää rivi'})} />
        </IconButton>
      )}
    </div>
  );
}

export default ({ config }) => {
  return {
    schema: {
      format: 'table',
      type: 'object',
      properties: {
        resultRow: {
          type: 'array',
          default: [],
          items: {
            type: 'string'
          },
        },
        table: {
          type: 'array',
          default: [],
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
      'ui:field': CalcTable,
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Laskentataulukko',
});

export const elementType = 'field';
