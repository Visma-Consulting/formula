import { FormattedMessage } from 'react-intl';

export default ({ formData, schema }) => {
  if(schema.enum) {
    return <FormattedMessage defaultMessage="Hyväksyn" />;
  } else {
    const defaultEnumNames = [schema.enumNames[0] === '' ? <FormattedMessage defaultMessage="Kyllä" /> : schema.enumNames[0], schema.enumNames[1] === '' ? <FormattedMessage defaultMessage="Ei" /> : schema.enumNames[1]];
    return formData === undefined ? <FormattedMessage defaultMessage="Ei valintaa" /> : defaultEnumNames?.[formData ? 0 : 1];
  }
};
