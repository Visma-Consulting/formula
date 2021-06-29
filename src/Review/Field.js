import Typography from '@material-ui/core/Typography';
import { createContext, useContext } from 'react';
import * as types from './types';

const TitleVariantContext = createContext();

export default function Field(props) {
  const Type = types[props.schema.type];
  if (!Type) {
    console.error('Not implemented', props.schema.type, props);
    return null;
  }

  const variant = useContext(TitleVariantContext) ?? 'h4';

  return (
    <TitleVariantContext.Provider
      value={
        {
          h4: 'h6',
          // h5 is reserved for pageTitle
          h6: 'subtitle1',
          subtitle1: 'subtitle2',
          subtitle2: 'subtitle2',
        }[variant]
      }
    >
      <div>
        {props.schema.title && (
          <Typography variant={variant} gutterBottom>
            {props.schema.title}
          </Typography>
        )}
        <div>
          <Type {...props} />
        </div>
        <br />
      </div>
    </TitleVariantContext.Provider>
  );
}
