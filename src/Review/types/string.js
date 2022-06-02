import Typography from '@material-ui/core/Typography';
import { byteLength } from 'base64-js';
import { format } from 'date-fns';
import { sortBy } from 'lodash';
import prettyBytes from 'pretty-bytes';
import { useIntl } from 'react-intl';
import { empty } from '..';
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
    formData =
      formData && format(new Date(formData), 'P', { locale: dateFnsLocale });
  }

  if (uiSchema?.['ui:widget'] === 'password') {
    formData = '********';
  }

  if (
    uiSchema?.['ui:widget'] === 'range' &&
    uiSchema['ui:options'].element?.widget === 'customScale'
  ) {
    return (
      <>
        <Typography variant="caption">
          {sortBy(uiSchema['ui:options'].element.scaleMarks, 'value')
            .map(({ value, label }) => value + ' = ' + label)
            .join(', ')}
        </Typography>
        <Data>{formData}</Data>
      </>
    );
  }

  const { locale } = useIntl();

  if (schema.format === 'data-url') {
    if (formData) {
      return (
        <>
          {decodeURIComponent(formData.match(/name=(?<name>.*);/).groups.name)}{' '}
          ({prettyBytes(dataUrlByteLength(formData), { locale })})
        </>
      );
    }
  }

  if (!uiSchema?.['ui:options']?.dummy) {
    formData ??= empty;
  }

  if (schema.format === 'markdown') {
    return <Markdown>{formData.replace('\\*', '*')}</Markdown>;
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

  return <Data>{formData}</Data>;
};

function Data({ children }) {
  return (
    <div style={{ whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
      {children}
    </div>
  );
}
