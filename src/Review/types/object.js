import Field from '../Field';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default (props) => {
  const { formData, schema, uiSchema } = props;

  // formGroups
  if (uiSchema['ui:order']) {
    return (uiSchema['ui:order'].map((name) => (
      <Field
        key={name}
        formData={formData?.[name]}
        schema={schema.properties[name]}
        uiSchema={uiSchema?.[name]}
      />)));
  }

  // tables
  if (schema.properties?.table) {
    const columns = uiSchema['ui:options'].element.tableColumns
    return (<TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((item, index) => <TableCell key={'header-'+index}>
              {item['fi']}
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
