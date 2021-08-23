export default ({ formData, schema }) => schema.enumNames?.[formData ? 0 : 1];
