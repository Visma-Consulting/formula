import { mapValues } from 'lodash';
import { useMemo } from 'react';
import ArrayField from './ArrayField';

const fields = { ArrayField };

export default (props) => ({
  ...props,
  fields: useMemo(
    () => mapValues(fields, (value, key) => value(props.fields?.[key])),
    [props.fields]
  ),
});
