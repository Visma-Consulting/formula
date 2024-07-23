import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {TableFooter} from "@mui/material";
import { format } from 'date-fns';
import Field from '../Field';
import { dynamicElements } from '../../useDynamicElements';
import {calcTypeSign} from "../../configToSchemas/types/calcTable.js";


const STATIC_ELEMENTS = ['body', 'image', 'title', 'pageTitle', 'subtitle', 'review']

const isAnswered = (element, formData) => {
  if (STATIC_ELEMENTS.includes(element?.type)) {
    // Static elements like body, title etc
    return true;
  } else if (formData === undefined || formData === '' || formData.length === 0) {
    // Formdata is empty
    return false;
  } else if (element?.list) {
    // Check every item in a list. If even one exists, return true
    for (const formDatum of formData) {
      if (isAnswered({...element, list: false}, formDatum)) {
        return true;
      }
    }
    return false;
  } else {
    // check rest of the situations based on element.type
    switch (element?.type) {
      case 'dateRange': return formData.start || formData.end;
      case 'boolean':
        if (formData) {
          return true;
        } else {
          return element.widget !== 'checkbox';
        }
      case 'calcTable':
      case 'tableField':
        if (formData.table.length === 0) {
          return false;
        } else {
          for (const row of formData.table) {
            for (const column of row) {
              if (column && column !== '') {
                return true;
              }
            }
          }
          return false;
        }
      case 'formGroup':
        for (const subElement of element.elements) {
          if (isAnswered(subElement, formData[subElement.key])) {
            return true;
          }
        }
        return false;
      default: return true;
    }
  }
}

export default (props) => {
  const { formData, schema, uiSchema, ...otherProps } = props;

  // dateRange
  if (uiSchema['ui:options']?.element.type === 'dateRange') {
    let start;
    let end;
    try {
      start =
        formData.start && format(new Date(formData.start), otherProps?.reviewProps?.dateFormat ?? 'd.M.yyyy');
      end =
        formData.end && format(new Date(formData.end), otherProps?.reviewProps?.dateFormat ?? 'd.M.yyyy');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`${otherProps?.reviewProps?.dateFormat} is not a valid dateformat, using default format d.M.yyyy`)
      start =
        formData.start && format(new Date(formData.start), 'd.M.yyyy');
      end =
        formData.end && format(new Date(formData.end), 'd.M.yyyy');
    }

    const dateValue = `${start ?? ''} - ${end ?? ''}`;
    return (
      <Field
        {...otherProps}
        formData={dateValue}
        schema={{ schema, type: 'string' }}
        uiSchema={uiSchema}
      />
    );
  }

  // confirmField
  if (uiSchema['ui:options']?.element.type === 'confirmField') {
    return (
      <Field
        {...otherProps}
        formData={formData.value}
        schema={{ schema, type: 'string' }}
        uiSchema={uiSchema}
      />
    );
  }

  // forms and formGroups
  if (uiSchema['ui:order']) {
    if (uiSchema['ui:options']?.element?.type === 'formGroup') {
      const elementKeys = dynamicElements(
        {
          ...uiSchema['ui:options'].element,
          list: false,
          title: undefined,
        },
        props.formData
      ).elements.map(element => element.key);
      return uiSchema['ui:order'].filter((name) => {
        return elementKeys.includes(name);
      }).filter(key => props.hideNotAnswered ? isAnswered(uiSchema[key]?.['ui:options']?.items?.element ?? uiSchema[key]?.['ui:options']?.element, formData[key]) : true)
        .map((name) => (
        <Field
          {...otherProps}
          key={name}
          formData={formData?.[name]}
          schema={schema.properties[name]}
          uiSchema={uiSchema?.[name]}
        />
      ));
    } else {
      if (props.hideNotAnswered) {
        return uiSchema['ui:order']
          .filter(key => isAnswered(props.config.elements.find(el => el.key === key), formData[key]))
          .map((name) => (
            <Field
              {...otherProps}
              key={name}
              formData={formData?.[name]}
              schema={schema.properties[name]}
              uiSchema={uiSchema?.[name]}
            />
          ));

        /*
        // Remove empty pages. Remove comments from lines 121-133 and 159 to use
        const hiddenRemovedKeys = uiSchema['ui:order']
          .filter(key => isAnswered(props.config.elements.find(el => el.key === key), formData[key]));
        const noEmptyPages = [];
        // eslint-disable-next-line @super-template/no-loops/no-loops
        for (const i in hiddenRemovedKeys) {
          if (Number(i) < hiddenRemovedKeys.length - 1) {
            const currentElement = props.config.elements.find(el => el.key === hiddenRemovedKeys[i]);
            const nextElement = props.config.elements.find(el => el.key === hiddenRemovedKeys[Number(i) + 1]);
            if (!(currentElement.type === 'pageTitle' && nextElement.type === 'pageTitle')) {
              noEmptyPages.push(hiddenRemovedKeys[i])
            }
          } else if (props.config.elements.find(el => el.key === hiddenRemovedKeys[i]).type !== 'pageTitle') {
            noEmptyPages.push(hiddenRemovedKeys[i])
          }
        }
        return noEmptyPages.map((name) => (
            <Field
              {...otherProps}
              key={name}
              formData={formData?.[name]}
              schema={schema.properties[name]}
              uiSchema={uiSchema?.[name]}
            />
          ));
          */
      } else {
        return uiSchema['ui:order']
          .map((name) => (
            <Field
              {...otherProps}
              key={name}
              formData={formData?.[name]}
              schema={schema.properties[name]}
              uiSchema={uiSchema?.[name]}
            />
          ));
      }
    }
  }

  // tables
  if (schema.properties?.table) {
    const element = uiSchema['ui:options'].element;
    const columns = element.type === 'calcTable'
      ? element.calcTableColumns.map(column => column.name + calcTypeSign[column.calcType])
      : element.tableColumns;
    const rows = element.useRowTitles ? element.rowTitles : [];
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {element.useRowTitles ? <TableCell key="header-row"/> : <></>}
              {columns.map((item, index) => (
                <TableCell key={'header-' + index}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formData?.table?.map((rowItem, rowIndex) => (
              <TableRow key={'row-' + rowIndex}>
                {element.useRowTitles
                  ? <TableCell style={{fontWeight: 'bold'}} key={'row-title-' + rowIndex}>{rowIndex < rows.length ? rows[rowIndex] : ''}</TableCell>
                  : <></>}
                {rowItem.map((item, itemIndex) => (
                  <TableCell key={'cell-' + rowIndex + '-' + itemIndex}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {element.type === 'calcTable' &&
            <TableFooter>
              {element.useRowTitles && <TableCell />}
              {formData.resultRow && formData.resultRow.length > 0 &&
                formData.resultRow.map(result => <TableCell style={{fontWeight: 'bold'}}>{result !== '' ? `= ${result}` : ''}</TableCell>)
              }
            </TableFooter>
          }
        </Table>
      </TableContainer>
    );
  }
};
