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

  const calcTypeSign = {
    none: '',
    sum: ' (+)',
    minus: ' (-)',
    multiplication: ' (*)',
    fraction: ' (/)'
  }

  const tableColumns = (ignoreTitleColumn) => {

    console.log(calcTableColumns);

    const columns = calcTableColumns.map(col =>
      // TODO: fix these references to col?.name after useLocalizeConfig fix
      col?.name?.fi ? col.name.fi + calcTypeSign[col.calcType] : ""
    );

    if (useRowTitles && !ignoreTitleColumn) {
      columns.unshift("");
    }

    return columns;
  }

  const tableData = makeTable(formData?.table || [], totalRows, totalCols);

  const makeRow = (data, dataIndex, row, tableColumns) => {

    // TODO: delete row -button

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
      cells.unshift(<TableCell align={"right"} key={'cell-' + dataIndex + '-' + '-1'}>
        {(rowTitles.length === 0 || dataIndex > rowTitles.length) ? "" :
          rowTitles[dataIndex]}
      </TableCell>);
    }

    return <TableRow key={`row-${dataIndex}-${rev}`}>
      {cells}
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
    const data = tableData.map(row => row[colNum])
      .filter(val =>  val !== null)
      .map(val => typeof val === 'string' ? val.replace(',', '.') : val)
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));

    if (data.length === 0) {
      return <TableCell align={"right"}>
        {column.calcType !== 'none' ? '= ' : ''}
      </TableCell>;
    }

    const sanitizeResult = (value) => '= ' +
      Number(value)
        .toFixed(2)
        .toString()
        .replace('.', ',');

    switch (column.calcType) {
      case 'sum':
        return <TableCell align={"right"} key={`footer-col-${colNum}`}>
          {sanitizeResult(data.reduce((partialSum, next) => partialSum + next))}
        </TableCell>
      case 'multiplication':
        return <TableCell align={"right"} key={`footer-col-${colNum}`}>
          {sanitizeResult(data.reduce((partialSum, next) => partialSum * next))}
        </TableCell>
      case 'minus':
        return <TableCell align={"right"} key={`footer-col-${colNum}`}>
          {sanitizeResult(data.reduce((partialSum, next) => partialSum - next))}
        </TableCell>
      case 'fraction':
        return <TableCell align={"right"} key={`footer-col-${colNum}`}>
          {sanitizeResult(data.reduce((partialSum, next) => partialSum / next))}
        </TableCell>
      default:
        return <TableCell>{'= '}</TableCell>;
    }
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
    customTableBodyFooterRender: () => makeFooter()
  };

  const onAddRow = (_) => {
    onPropertyChange(makeTable(tableData, totalRows + 1, totalCols));
  };

  const onPropertyChange = (tableData) => {
    // TODO: update result row here
    onChange({ table: tableData }, errorSchema);
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

  console.log("CONF");
  console.log(config);

  // TODO: add result row
  return {
    schema: {
      format: 'table',
      type: 'object',
      properties: {
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
