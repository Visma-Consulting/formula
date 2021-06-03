//import { Autocomplete } from '@material-ui/lab';

export const types = ['select', 'multiselect'];

function AutocompleteField(props) {
  return '<Autocomplelte />';
}

export const converter = (config) => (props) => {
  if (config.autocomplete) {
    props.uiSchema ??= {};
    props.uiSchema['ui:field'] = AutocompleteField;

    // To let AutocompleteField know if this is select or multiselect
    props.uiSchema['ui:options'] ??= {};
    props.uiSchema['ui:options'].type = config.type;
  }
};
