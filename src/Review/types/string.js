import { format } from 'date-fns';
import { PageTitle } from '../../configToSchemas/types/pageTitle';
import Typography from '@material-ui/core/Typography';
import prettyBytes from 'pretty-bytes';
import { byteLength } from 'base64-js';
import { useIntl } from 'react-intl';
import { useFormulaContext } from '../../Context';

const dataUrlByteLength = (dataUrl) => byteLength(dataUrl.split(',')[1]);

export default ({ formData, schema, uiSchema }) => {
  const { dateFnsLocale } = useFormulaContext();

  if (schema.enumNames) {
    formData = schema.enumNames[schema.enum.indexOf(formData)];
  }

  if (schema.format === 'date') {
    formData = format(new Date(formData), 'P', { locale: dateFnsLocale });
  }

  const { locale } = useIntl();

  if (schema.format === 'data-url') {
    return (
      <>
        {decodeURIComponent(formData.match(/name=(?<name>.*);/).groups.name)} (
        {prettyBytes(dataUrlByteLength(formData), { locale })})
      </>
    );
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
