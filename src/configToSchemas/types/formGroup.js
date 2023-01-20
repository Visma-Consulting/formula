import { defineMessage } from 'react-intl';
import form from './form';

export default (props) => {
  const {schema, uiSchema} = form(props);
  return {
    schema: {
      ...schema,
      requireAtLeastOne: props?.config?.requireAtLeastOne,
      handleFalseAsUndefined: props?.config?.handleFalseAsUndefined
    },
    uiSchema};
};

export const name = defineMessage({
  defaultMessage: 'Kysymysryhmä',
});

export const elementType = 'element';
