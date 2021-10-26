import withLoader from './withLoader';
import withLoadFormData from './withLoadFormData';

export default (Form) => Form |> withLoadFormData |> withLoader;
