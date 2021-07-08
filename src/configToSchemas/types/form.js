import deprecate from 'util-deprecate';
import configToProps from '..';
import { setLegacyMode } from '../../legacyMode';

const formgroupType = deprecate((config) => {
  setLegacyMode();

  return { ...config, type: 'formGroup' };
}, 'type "formgroup" is deprecated. Use "formGroup" instead.');

export default ({ config, ...otherProps }) => {
  const properties = config.elements
    .map((element) => {
      if (element.type === 'formgroup') {
        return formgroupType(element);
      }
      return element;
    })
    .map((element) => [
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
      // Ensure order of the elements is remained.
      'ui:order': properties.map(([key]) => key),
    },
  };
};
