//import { show } from '@visma/formula/lib/useDynamicElements';
import ArrayField from '@visma/rjsf-core/lib/components/fields/ArrayField';
import { injectIntl } from 'react-intl';

const withMultipleFilesAsList = (Base) =>
  class ArrayField extends (Base.WrappedComponent ?? Base) {
    renderFiles() {
      return this.renderNormalArray();
    }
  };

// const withFilterFields = (Base) =>
//   class ArrayField extends (Base.WrappedComponent ?? Base) {
//     renderArrayFieldItem(props) {
//       return super.renderArrayFieldItem(
//         props.itemSchema.type === 'object'
//           ? {
//               ...props,
//               itemSchema: {
//                 ...props.itemSchema,
//                 properties: pickBy(
//                   props.itemSchema.properties,
//                   (property, id) =>
//                     show(
//                       props.itemData || {},
//                       props.itemUiSchema?.[id]?.['ui:options']?.element || {}
//                     )
//                 ),
//               },
//             }
//           : props
//       );
//     }
//   };

export default (Base = ArrayField) =>
  Base
  |> withMultipleFilesAsList |>
  //withFilterFields |>
  injectIntl;
