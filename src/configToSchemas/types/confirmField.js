import {defineMessage} from "react-intl";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {utils} from "@visma/rjsf-core";
import Typography from "@material-ui/core/Typography";
import {defineMessages} from "@formatjs/intl";

const useStyles = makeStyles({
  inputLabelRoot: {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
  },
  inputFormControl: {
    "label + &": {
      marginTop: 0
    }
  }
});

const ConfirmField = (props) => {
  const {schema, uiSchema, formData, onChange, idSchema, required, readonly, disabled} = props;
  const options = uiSchema['ui:options'].element;
  const classes = useStyles();
  return (<>
    <TextField
      id={idSchema.value.$id}
      label={options.useLabel ? options.label : options.title}
      InputLabelProps={{shrink: false, className: classes.inputLabelRoot}}
      required={required}
      readOnly={readonly}
      disabled={disabled}
      value={formData.value}
      pattern={schema.pattern}
      onChange={(e) => { onChange({...formData, value: e.target.value}) }}
    />
    <Typography
      aria-hidden={true}
      component="p"
      style={{paddingTop: 30}}
      variant="subtitle1">
      { options.confirmTitle }
      { props.required && " *" }
    </Typography>
    <TextField
      id={idSchema.confirmation.$id}
      label={(options.useLabel ? options.label : options.title) + + " (uudestaan)" }
      InputLabelProps={{shrink: false, className: classes.inputLabelRoot}}
      required={required}
      readOnly={readonly}
      disabled={disabled}
      value={formData.confirmation}
      pattern={schema.pattern}
      onChange={(e) => { onChange({...formData, confirmation: e.target.value}) }}
    />
  </>)
}

export default ({config}) => ({
  schema: {
    type: 'object',
    format: 'confirmField',
    properties: {
      value: {
        type: 'string'
      },
      confirmation: {
        type: 'string'
      }
    }
  },
  uiSchema : {
    'ui:field': ConfirmField
  }
});

export const name = defineMessage({
  defaultMessage: 'Sähköpostiosoite vahvistuksella',
});

export const elementType = 'field';

const validationMessages = defineMessages({
  noMatch: {
    defaultMessage: `"{title}" arvon täytyy olla sama kuin "{confirmTitle}" arvo`
  },
  notEmail: {
    defaultMessage: `"{title}" arvon on oltava kelvollinen sähköpostiosoite`
  }
});

export const validators = {
  validate: {
    name: defineMessage({
      defaultMessage: 'Kenttien vertaaminen'
    }),
    fn: (value, element) => {
      const pattern = new RegExp(element.required ? '[^\\s]+^$|^(.*@[a-zA-Z0-9]+[a-zA-Z0-9\\.-]*\\.[a-zA-Z0-9]{2,})$' : '^$|^(.*@[a-zA-Z0-9]+[a-zA-Z0-9\\.-]*\\.[a-zA-Z0-9]{2,})$');

      if (!pattern.test(value.value)) {
        return validationMessages.notEmail;
      }

      if (value.value !== value.confirmation) {
        return validationMessages.noMatch;
      }
    }
  }
}
