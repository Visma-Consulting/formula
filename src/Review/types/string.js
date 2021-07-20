import { format } from 'date-fns';
import { PageTitle } from '../../configToSchemas/types/pageTitle';
import Typography from '@material-ui/core/Typography';
import { useFormulaContext } from '../../Context';

export default ({ formData, schema, uiSchema }) => {
  const { dateFnsLocale } = useFormulaContext();

  if (schema.enumNames) {
    formData = schema.enumNames[schema.enum.indexOf(formData)];
  }

  if (schema.format === 'date') {
    formData = format(new Date(formData), 'P', { locale: dateFnsLocale });
  }

  if (uiSchema?.['ui:field'] === PageTitle) {
    return (
      <Typography variant="h5" gutterBottom>
        {uiSchema['ui:title']}
      </Typography>
    );
  }

  return <div style={{ whiteSpace: 'pre-line' }}>{formData}</div>;
};
