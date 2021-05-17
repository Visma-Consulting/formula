import configToSchema from './configToSchema';
import configToUISchema from './configToUISchema';

export default function configToSchemas(config) {
  const formConfig = {
    type: 'form',
    ...config,
  };

  return {
    schema: configToSchema(formConfig),
    uiSchema: configToUISchema(formConfig),
  };
}
