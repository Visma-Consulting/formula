import { useFields, useFormGroups } from './api';
import { typesWithElements } from './utils';

export default function useResolveElementReferences() {
  const registry = {
    formGroup: useFormGroups(),
    field: useFields(),
  };

  function resolveElement(element) {
    const registryElements = registry[element.type];

    return registryElements
      ? {
          ...element,
          ...(registryElements.find(
            (registryElement) => registryElement._id === element.id
          ) |> resolveElementReferences),
        }
      : element;
  }

  function resolveConfig({ elements, ...other }) {
    return {
      ...other,
      elements: elements?.map(resolveElement),
    };
  }

  function resolveElementReferences(config) {
    return typesWithElements.includes(config?.type)
      ? resolveConfig(config)
      : config;
  }

  return resolveElementReferences;
}
