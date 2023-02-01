import extendType from './_extendType';
import number from './number';
import { defineMessage } from 'react-intl';

export default extendType(number, ({ config }) => (props) => {
  if (!config.numberDefault || config.numberDefault > config.maximum || config.numberDefault < config.minimum) {
    props.schema.default = config.minimum ?? 0;
  }
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = 'range';
});

export const name = defineMessage({
  defaultMessage: 'Liukusäädin',
});

export const elementType = 'field';

export const scaleTypes = [
  {
    value: 'noScale',
    message: defineMessage({
      defaultMessage: 'Ei asteikkoa',
    })
  },
  {
    value: 'automaticScale',
    message: defineMessage({
      defaultMessage: 'Automaattinen asteikko',
    })
  },
  {
    value: 'customScale',
    message: defineMessage({
      defaultMessage: 'Määrittele oma asteikko',
    })
  }
];
