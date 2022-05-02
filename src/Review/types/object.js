import Field from '../Field';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';
import { useFormulaContext } from '../../Context';

export default (props) => {
  // eslint-disable-next-line prefer-const
  let { formData, schema, uiSchema } = props;
  const { dateFnsLocale } = useFormulaContext();
  const ui = props.uiSchema['ui:options'].element

  // formGroups
  if (uiSchema['ui:options']?.element.type === 'dateRange') {
    const start = formData.start ? format(new Date(formData.start), 'P', { locale: dateFnsLocale }) : "";
    const end = formData.end ? format(new Date(formData.end), 'P', { locale: dateFnsLocale }) : "";
    const dateValue = `${start} - ${end}`;
    return (
      <Field
        key={ui.id}
        formData={dateValue}
        schema={{schema, type: 'string' }}
        uiSchema={uiSchema}
      />);
  } else {
    if (uiSchema['ui:order']) {
      return (uiSchema['ui:order'].map((name) => (
        <Field
          key={name}
          formData={formData?.[name]}
          schema={schema.properties[name]}
          uiSchema={uiSchema?.[name]}
        />)));
    }
  }


  // tables
  if (schema.properties?.table) {
    const columns = uiSchema['ui:options'].element.tableColumns
    return (<TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((item, index) => <TableCell key={'header-'+index}>
              {item}
            </TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {formData.table?.map((rowItem, rowIndex) => (
            <TableRow key={'row-'+rowIndex}>{rowItem.map((item, itemIndex) => (
              <TableCell key={'cell-'+rowIndex+'-'+itemIndex}>
                {item}
              </TableCell>
            ))}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>);
  }
}
