import { uniq } from 'lodash';
import configToProps from '..';

export default ({ config, ...otherProps }) => {
  const properties = config.elements.map((element) => [
    element.key,
    configToProps({ ...otherProps, config: element }),
  ]);
  return {
    schema: {
      type: 'object',
      properties: Object.fromEntries(
        properties.map(([name, { schema }]) => [name, schema])
      ),
      required: config.elements
        .filter(({ required }) => required)
        .map(({ key }) => key),
    },
    uiSchema: {
      ...Object.fromEntries(
        properties.map(([name, { uiSchema }]) => [name, uiSchema])
      ),
      // Ensure the order of the elements is remained.
      'ui:order': uniq(properties.map(([key]) => key)),
    },
  };
};
