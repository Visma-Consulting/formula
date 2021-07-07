import { filterElements } from '../../useDynamicElements';
import configToSchemas from '..';

export default (config) => (props) => {
  if (config.oneOf) {
    const choicesAndProps = config.oneOf.choices.map((choice) => ({
      choice,
      props: configToSchemas({
        config: {
          ...config,
          elements: filterElements(config.elements, {
            [config.oneOf.key]: choice.enum,
          }),
          oneOf: undefined,
          list: false,
        },
      }),
    }));
    props.schema.type = 'object';
    props.schema.properties = {
      [config.oneOf.key]: {
        type: 'string',
        title: config.oneOf.title,
        default: config.oneOf.default,
        enum: config.oneOf.choices.map((choice) => choice.enum),
        enumNames: config.oneOf.choices.map((choice) => choice.enumNames),
      },
    };
    props.schema.dependencies = {
      [config.oneOf.key]: {
        oneOf: choicesAndProps.map(({ choice, props }) => ({
          properties: {
            [config.oneOf.key]: { enum: [choice.enum] },
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
