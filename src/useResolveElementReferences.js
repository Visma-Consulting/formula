import { useFields, useFormGroups } from './api';
import { typesWithElements } from './utils';

export default function useResolveElementReferences() {
  const registry = {
    formGroup: useFormGroups(),
    field: useFields(),
  };

  return function resolveElementReferences(config) {
    const resolveElement = (element) => {
      const registryElements = registry[element.type];

      return registryElements
        ? {
            ...element,
            ...(registryElements.find(
              (registryElement) => registryElement._id === element.id
            ) |> resolveElementReferences),
          }
        : element;
    };

    const resolveConfig = ({ elements, ...other }) => ({
      ...other,
      elements: elements.map(resolveElement),
    });

    return typesWithElements.includes(config?.type)
      ? resolveConfig(config)
      : config;
  };
}
