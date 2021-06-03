import { forwardRef } from 'react';
import { useForm } from './api';
import useResolveElementReferences from './useResolveElementReferences';

export default function withFormConfigLoader(Component) {
  const Resolver = forwardRef(({ config, ...other }, ref) => (
    <Component
      ref={ref}
      {...other}
      config={config |> useResolveElementReferences()}
    />
  ));

  const Loader = forwardRef(({ id, ...other }, ref) => (
    <Resolver ref={ref} {...other} config={useForm(id)} />
  ));

  return forwardRef((props, ref) => {
    const Formula =
      // Load config and resolve elements
      props.id
        ? Loader
        : // Optionally resolve directly provided config
        props.resolve
        ? Resolver
        : Component;
    return <Formula ref={ref} {...props} />;
  });
}
