import { defineMessage, useIntl } from 'react-intl';
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
import { makeStyles } from '@material-ui/core/styles';
import { defineMessages } from '@formatjs/intl';
import { utils } from '@visma/rjsf-core';
import { FormHelperText } from '@material-ui/core';

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
  const { tableColumns = [] } = field;
  return tableColumns.length || 0;
};

function TableField(props) {
  const {
    disabled,
    readonly,
    onChange,
    formData,
    errorSchema,
    uiSchema,
    idSchema,
    schema,
    rawErrors
  } = props;
  const config = uiSchema['ui:options'].element;
  const {
    tableAddAllowed = false,
    tableRowMinimum = 0,
    tableRowMaximum = Number.MAX_SAFE_INTEGER,
    useLabel = false,
    tableColumns = [],
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

  const onPropertyChange = (tableData) => {
    onChange({ table: tableData }, errorSchema);
    if (totalRows !== tableData.length) {
      setRev(uniqueId());
    }
  };

  const onAddRow = (_) => {
    onPropertyChange(makeTable(tableData, totalRows + 1, totalCols));
  };

  const onRemoveRow = (rowNum) => {
    onPropertyChange(tableData.filter((_, index) => index !== rowNum));
  };

  const tableData = makeTable(formData?.table || [], totalRows, totalCols);

  const tableHeaders = (ignoreTitleColumn) => {
    const headers = tableColumns.map((columnName, index) => (
      <TableCell key={index}>{columnName}</TableCell>
    ));

    if (useRowTitles && !ignoreTitleColumn) {
      headers.unshift(<TableCell key={-1}>{""}</TableCell>);
    }

    return headers;
  }

  const tableCells = tableData.map((row, rowNum) => {
    return (
      <TableRow key={`row-${rowNum}-${rev}`}>
        {useRowTitles &&
          <TableCell style={{fontWeight: 'bold'}}>{rowNum < rowTitles.length ? rowTitles[rowNum] : ''}</TableCell>
        }
        {row.map((_, colNum) => (
          <TableCell key={`col-${colNum}`}>
            <TextField
              id={`${id}-${rowNum}-${colNum}`}
              style={{ width: '100%' }}
              variant="outlined"
              size="small"
              aria-label={intl.formatMessage(tableLabel,
                {
                  tableName: useLabel ? label : title,
                  columnName: tableColumns[colNum],
                  row: rowNum + 1
                })
              }
              label={useLabel ? label : title}
              defaultValue={tableData[rowNum][colNum]}
              disabled={disabled}
              readOnly={readonly}
              onChange={(event) => {
                tableData[rowNum][colNum] = event.target.value || defaultValue;
                onPropertyChange(tableData);
              }}
              InputProps={{classes: { formControl: classes.inputFormControl}, 'aria-describedby': ariaDescribedby}}
              InputLabelProps={{
                htmlFor: `${id}-${rowNum}-${colNum}`,
                shrink: false,
                className: classes.inputLabelRoot
              }}
            />
          </TableCell>
        ))
        .concat(
          tableData.length > tableRowMinimum ? (
            rowNum >= tableRowMinimum ? (
              <TableCell key={'remove'}>
                <IconButton
                  aria-label={intl.formatMessage({defaultMessage: 'Poista rivi'})}
                  onClick={(_) => {
                    onRemoveRow(rowNum);
                  }}
                  disabled={disabled || readonly}
                >
                  <DeleteIcon alt={intl.formatMessage({defaultMessage: 'Poista rivi'})} />
                </IconButton>
              </TableCell>
            ) : (
              <TableCell key={'remove'}>&nbsp;</TableCell>
            )
          ) : (
            []
          )
        )}
      </TableRow>
    );
  });

  return (
    <div>
      <FormHelperText id={`${idSchema.$id}__description`} component="span">{description}</FormHelperText>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>{tableHeaders()}</TableRow>
          </TableHead>
          <TableBody>{tableCells}</TableBody>
        </Table>
      </TableContainer>
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
      'ui:field': TableField,
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Taulukko',
});

const validationMessages = defineMessages({
  emptyValue: {
    defaultMessage: `"{title}" ei saa sisältää tyhjiä soluja.`
  }
});

export const validators = {
   required: {
    name: defineMessage({
      defaultMessage: 'Pakollinen taulukko'
    }),
    fn: (value, element) => {
      if (value && value.table?.length > 0) {
        for (const row of value.table) {
          for (const item of row) {
            if (item === undefined || item === '') {
              return validationMessages.emptyValue;
            }
          }
        }
      } else {
        return validationMessages.emptyValue;
      }
    }
  }
};

export const elementType = 'field';
