import { defineMessage } from 'react-intl';
import _dummy from './_dummy';
import extendType from './_extendType';

// Used to identify step split points and display only the elements of the step.
export const StepTitle = () => null;

export default extendType(_dummy, ({ config: { content } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = StepTitle;
  props.uiSchema['ui:title'] = content;
});

export const name = defineMessage({
  defaultMessage: 'Vaiheen erotin ja otsikko',
});

export const elementType = 'element';
