import Typography from '@material-ui/core/Typography';
import { byteLength } from 'base64-js';
import { format } from 'date-fns';
import { sortBy } from 'lodash';
import prettyBytes from 'pretty-bytes';
import { useIntl } from 'react-intl';
import { empty } from '..';
import { StepTitle } from '../../configToSchemas/types/stepTitle';
import { TitleField } from '../../configToSchemas/types/title';
import Markdown from '../../Markdown';

const dataUrlByteLength = (dataUrl) => byteLength(dataUrl.split(',')[1]);

function calculatePageTitleNumber(pageTitles, pageTitle) {
  if(pageTitle['ui:title'] && pageTitles) {
    return pageTitles?.findIndex(obj => (obj.content === pageTitle['ui:title'] && obj.key === pageTitle['ui:options']?.element?.key)) + 1 + '. ';
  }
}

export default ({ formData, schema, uiSchema, pageTitles, reviewProps}) => {
  if (schema.enumNames) {
    if (schema.inline) {
      formData = formData.map((data) => schema.enumNames[schema.enum.indexOf(data)]).join(', ');
    } else {
      formData = schema.enumNames[schema.enum.indexOf(formData)];
    }
  }
  if ((uiSchema?.['ui:field'] === StepTitle || uiSchema?.['ui:field'] === TitleField) && uiSchema['ui:title']) {
    return (
      <Typography variant="h5"
        style={{
        paddingTop: "35px"
      }}>
        {calculatePageTitleNumber(pageTitles, uiSchema)}{uiSchema['ui:title']}
      </Typography>
    );
  }

  if (schema.format === 'date') {
    try {
      formData =
        formData && format(new Date(formData), reviewProps?.dateFormat ?? 'd.M.yyyy');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`${reviewProps?.dateFormat} is not a valid dateformat, using default format d.M.yyyy`)
      formData =
        formData && format(new Date(formData), 'd.M.yyyy');
    }
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

  if(uiSchema?.['ui:options']?.dummy) {
    const element = uiSchema?.['ui:options']?.element;
    switch (element?.type) {
      case 'body': return <Markdown>{element.content?.replace('\\*', '*')}</Markdown>;
      case 'title': case 'subtitle': return <Typography variant="h6">{element?.content}</Typography>;
      default: return <Typography variant="body1">{element?.content}</Typography>;
    }
  }

  if (schema.format === 'markdown') {
    return <Markdown>{formData.replace('\\*', '*')}</Markdown>;
  }

  if (uiSchema?.['ui:options']?.unit) {
    formData = `${formData} ${uiSchema['ui:options'].unit}`;
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
