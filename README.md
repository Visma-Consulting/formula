# @visma/formula 🏎

React component for configurable forms. Optionally connect to the backend to fetch external config and submit form data to.

## Requirements

Material UI v4 and `react-intl` are required. Install and set up if necessary:

```sh
npm i @visma/formula @material-ui/core @material-ui/icons @material-ui/lab react-intl --legacy-peer-deps
```

## Examples

### Login form

```js
import Formula from '@visma/formula';

<Formula
  config={{
    title: 'Log In',
    elements: [
      {
        key: 'email',
        type: 'email',
        name: 'Email Address',
        required: true,
      },
      {
        key: 'password',
        type: 'password',
        name: 'Password',
        required: true,
      },
    ],
  }}
  onSubmit={({ values }) => console.log(values)}
/>;
```

### Use external config

```js
import Formula from '@visma/formula';

<Formula
  axios={(axios) => {
    axios.defaults.baseURL = 'https://example.com/formula/api';
    axios.defaults.headers.common.Authorization = 'Bearer <token>';
  }}
  id="1"
/>;
```

## Components

### `<Formula>`

#### Props

One of `config`, `id` or `dataId` is required. Rest are optional.

| Name            | Type                                                            | Description                                                                                                                                         |
| --------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`        | (TBD)                                                           | Form config                                                                                                                                         |
| `id`            | `string`                                                        | External form config id                                                                                                                             |
| `dataId`        | `string`                                                        | Resume editing                                                                                                                                      |
| `onSubmit`      | `({ formData }) => void`                                        | Override default submit handler                                                                                                                     |
| `onPostSubmit`  | `(dataId, { formData }) => void`                                | Get `dataId` of submitted form                                                                                                                      |
| `confirm`       | `boolean \| { title: ReactElement, description: ReactElement }` | Disable confirm dialog or use object for other messages. Default: `true`                                                                            |
| `axios`         | `axios => void`                                                 | Get access to API client's axios instance e.g. to set defaults                                                                                      |
| `dateFnsLocale` | `Locale` from `date-fns`                                        | Examples:<br />`import useDateFnsLocale from '@visma/react-app-locale-utils/lib/useDateFnsLocale.js';`<br />`import { fi } from 'date-fns/locale';` |
| `children`      | `ReactElement`                                                  | Override default submit button. Set `<></>` (empty React Frament) to render nothing.                                                                |

### `<FormulaProvider>`

Provide options for any `<Form>` component in children.

Required to use API hooks.

#### Props

Same as for `<Formula>`, except:

- Without `config`, `id`, `dataId`
- `children: ReactElement`: App, wrapped forms

### `<Form>`

#### Props

`config`, `id`, `dataId` and `children` from `<Formula>`

## Hooks

See [src/api.js](src/api.js) for all API hooks.

```js
import { useForms } from '@visma/formula';

function ListForms() {
  const forms = useForms({ status: 'published', visibility: 'public' });
  // ...
}
```

```js
import { useForm } from '@visma/formula';

function FormTitle({ id }) {
  const form = useForm(id);

  return <h1>{form.title}</h1>;
}
```
