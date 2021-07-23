import { forwardRef } from 'react';
import invariant from 'tiny-invariant';
import { useForm } from './api';
import useResolveElementReferences from './useResolveElementReferences';

export default function withFormConfigLoader(Form) {
  const Resolver = forwardRef(({ config, ...other }, ref) => (
    <Form
      ref={ref}
      {...other}
      config={config |> useResolveElementReferences()}
    />
  ));

  const Loader = forwardRef(({ id, ...other }, ref) => {
    invariant(
      !(id && other.config),
      'You should not use prop `id` with `config`'
    );

    return <Resolver ref={ref} {...other} config={useForm(id)} />;
  });

  return forwardRef((props, ref) => {
    const WithFormConfigLoader =
      // Load config and resolve elements
      props.id
        ? Loader
        : // Optionally resolve directly provided config
        props.resolve
        ? Resolver
        : Form;
    return <WithFormConfigLoader ref={ref} {...props} />;
  });
}
