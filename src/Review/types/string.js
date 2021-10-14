import Typography from '@material-ui/core/Typography';
import { byteLength } from 'base64-js';
import { format } from 'date-fns';
import prettyBytes from 'pretty-bytes';
import { useIntl } from 'react-intl';
import { StepTitle } from '../../configToSchemas/types/stepTitle';
import { useFormulaContext } from '../../Context';
import Markdown from '../../Markdown';

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

  if (schema.format === 'markdown') {
    return <Markdown>{formData}</Markdown>;
  }

  if (uiSchema?.['ui:options']?.unit) {
    formData = `${formData} ${uiSchema['ui:options'].unit}`;
  }

  if (uiSchema?.['ui:field'] === StepTitle) {
    return (
      <Typography variant="h5" gutterBottom>
        {uiSchema['ui:title']}
      </Typography>
    );
  }

  return <div style={{ whiteSpace: 'pre-line' }}>{formData}</div>;
};
