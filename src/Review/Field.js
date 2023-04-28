import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createContext, useContext } from 'react';
import { Customize } from '../utils';
import * as types from './types';

const useStyles = makeStyles((theme) => ({
  typeContainer: {
    marginBottom: theme.spacing(3),
  },
}));

const TitleVariantContext = createContext();

const titleComponents = {
  form: 'h2',
  formGroup: 'h3',
}

export default function Field({ __withStepped_original_props__, ...props }) {
  const classes = useStyles();
  if (__withStepped_original_props__) {
    props = { ...props, ...__withStepped_original_props__ };
  }
  const Type = types[props.schema.type];
  const variant = useContext(TitleVariantContext) ?? 'h4';

  if (!Type) {
    console.error('Not implemented', props.schema.type, props);
    return null;
  }

  if (props.uiSchema &&
    (props.uiSchema['ui:widget'] === 'hidden' || props.uiSchema['ui:options']?.element?.type === 'compose' || props.uiSchema['ui:options']?.element?.type === 'button')) {
    return null;
  }

  const element = props.uiSchema?.items
    ? props.uiSchema.items['ui:options']?.element
    : props.uiSchema?.['ui:options']?.element;

  return (
    <TitleVariantContext.Provider
      value={
        {
          h4: 'h6',
          // h5 is reserved for stepTitle
          h6: 'h6',
          subtitle1: 'subtitle2',
          subtitle2: 'subtitle2',
        }[variant]
      }
    >
      <Box pl={element && element.indent ? 3 * element.indent : 0}>
        <Customize
          customizer={props[props.preview ? 'previewField' : 'reviewField']}
          {...props}
        >
          {props.schema.title && (
            <Typography variant={variant} component={
              Object.keys(titleComponents).includes(element.type) ? titleComponents[element.type] : 'p'
            } gutterBottom>
              {props.schema.title}
            </Typography>
          )}
          { ((element?.type === "formGroup" && !element?.list)
            || (element?.type === "formGroup" && element?.list && props?.schema?.type === "array"))
            && <hr/> }
          <div className={classes.typeContainer}>
            <Type {...props} />
          </div>
          { element?.type === "formGroup" && props?.schema?.type !== "array" && <><hr/><p></p></> }
        </Customize>
      </Box>
    </TitleVariantContext.Provider>
  );
}
