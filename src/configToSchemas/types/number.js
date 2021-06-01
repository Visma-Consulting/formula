export default ({ default: defaultValue, maximum, minimum, multipleOf }) => ({
  schema: {
    default: defaultValue ?? minimum ?? 0,
    maximum,
    minimum,
    multipleOf,
    type: 'number',
  },
});
