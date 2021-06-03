import { useFields, useFormGroups } from './api';

const typesWithElements = ['form', 'formGroup'];

export default function useResolveElementReferences() {
  const registry = {
    // In list of elements the type of `formGroup` element is spelled in lowercase
    formgroup: useFormGroups(),
    field: useFields(),
  };

  return function resolveElementReferences(config) {
    const resolveElement = (element) => {
      const registryElements = registry[element.type];

      return registryElements
        ? registryElements.find(
            (registryElement) => registryElement._id === element.id
          ) |> resolveElementReferences
        : element;
    };

    const resolveConfig = ({ elements, ...other }) => ({
      ...other,
      elements: elements.map(resolveElement),
    });

    return typesWithElements.includes(config.type)
      ? resolveConfig(config)
      : config;
  };
}
