import { useFields, useFormGroups } from './api';

export default function useResolveElementReferences() {
  const fields = useFields();
  const formGroups = useFormGroups();

  return function resolveElementReferences({ elements, ...other }) {
    const toResolvedElementReference = (element) =>
      ({
        field() {
          return fields.find((field) => field._id === element.id);
        },
        formgroup() {
          return resolveElementReferences({
            type: 'formGroup',
            ...formGroups.find((formGroup) => formGroup._id === element.id),
          });
        },
      }[element.type]?.() ?? element);

    return {
      ...other,
      elements: elements.map(toResolvedElementReference),
    };
  };
}
