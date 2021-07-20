export default ({ formData, schema }) => schema.enumNames?.[formData ? 1 : 0];
