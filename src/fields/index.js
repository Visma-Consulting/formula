import { mapValues } from 'lodash';
import ArrayField from './ArrayField';

const fields = { ArrayField };

export default (props) => ({
  ...props,
  fields: mapValues(fields, (value, key) => value(props.fields?.[key])),
});
