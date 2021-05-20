export default ({
  default: defaultValue,
  minLength,
  maxLength,
  pattern,
  readOnly,
  required,
}) => ({
  schema: {
    default: defaultValue,
    minLength: minLength ?? (required ? 1 : undefined),
    maxLength,
    pattern,
    readOnly,
    type: 'string',
  },
});
