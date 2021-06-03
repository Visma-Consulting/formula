function TableField() {
  return '(TableField stub)';
}

export default ({ config }) => {
  return {
    schema: {
      type: 'object',
      properties: {
        table: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    uiSchema: {
      'ui:field': TableField,
      'ui:options': {
        tableField: { config },
      },
    },
  };
};
