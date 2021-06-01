import extendType from './_extendType';
import select from './select';

export default extendType(select, (config) => (props) => {
  props.schema = {
    items: props.schema,
    type: 'array',
    uniqueItems: true,
  };
  props.uiSchema = {
    'ui:widget': { 0: 'checkboxes' }[config.multiselectWidget],
  };
});
