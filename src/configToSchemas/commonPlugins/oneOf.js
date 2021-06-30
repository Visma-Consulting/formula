import { filterElements } from '../../useDynamicElements';
import configToSchemas from '..';

export default (config) => (props) => {
  if (config.oneOf) {
    const choicesAndProps = config.oneOf.choices.map((choice) => ({
      choice,
      props: configToSchemas({
        config: {
          ...config,
          elements: filterElements(config.elements, { type: choice.enum }),
          oneOf: undefined,
          list: false,
        },
      }),
    }));
    props.schema.type = 'object';
    props.schema.properties = {
      type: {
        type: 'string',
        enum: config.oneOf.choices.map((choice) => choice.enum),
        enumNames: config.oneOf.choices.map((choice) => choice.enumNames),
      },
    };
    props.schema.dependencies = {
      type: {
        oneOf: choicesAndProps.map(({ choice, props }) => ({
          properties: {
            type: { enum: [choice.enum] },
            ...props.schema.properties,
          },
        })),
      },
    };

    props.uiSchema = {};
    /*
    uiSchema does not support oneOf style dynamic fields?

    props.uiSchema = {
      type: {
        oneOf: choicesAndProps.map(({ choice, props }) => ({
          properties: {
            type: { enum: [choice.enum] },
            ...props.uiSchema.properties,
          },
        })),
      },
    };
    */
  }
};
