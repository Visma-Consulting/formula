import { FormattedMessage } from 'react-intl';

export default ({ formData, schema }) => {
  const defaultEnumNames = [schema.enumNames[0] === '' ? <FormattedMessage defaultMessage="Kyllä" /> : schema.enumNames[0], schema.enumNames[1] === '' ? <FormattedMessage defaultMessage="Ei" /> : schema.enumNames[1]];
  return defaultEnumNames?.[formData ? 0 : 1];
}
