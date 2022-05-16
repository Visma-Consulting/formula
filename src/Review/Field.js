import Typography from '@material-ui/core/Typography';
import { createContext, useContext } from 'react';
import * as types from './types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  typeContainer: {
    marginBottom: theme.spacing(3),
  },
}));

const TitleVariantContext = createContext();

export default function Field(props) {
  const classes = useStyles();
  const Type = types[props.schema.type];
  const variant = useContext(TitleVariantContext) ?? 'h4';

  if (!Type) {
    console.error('Not implemented', props.schema.type, props);
    return null;
  }

  if (props.uiSchema &&
    (props.uiSchema['ui:widget'] === 'hidden' || props.uiSchema['ui:options']?.element?.type === 'compose')) {
    return null;
  }

  return (
    <TitleVariantContext.Provider
      value={
        {
          h4: 'h6',
          // h5 is reserved for stepTitle
          h6: 'subtitle1',
          subtitle1: 'subtitle2',
          subtitle2: 'subtitle2',
        }[variant]
      }
    >
      <>
        {props.schema.title && (
          <Typography variant={variant} gutterBottom>
            {props.schema.title}
          </Typography>
        )}
        <div className={classes.typeContainer}>
          <Type {...props} />
        </div>
      </>
    </TitleVariantContext.Provider>
  );
}
