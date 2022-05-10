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

| Name               | Type                                                                         | Description                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`           | [Form](https://visma-consulting.github.io/formula/docs/interfaces/Form.html) | Form config                                                                                                                                         |
| `id`               | `string`                                                                     | External form config id                                                                                                                             |
| `dataId`           | `string`                                                                     | Resume editing                                                                                                                                      |
| `onSubmit`         | `({ values }) => void`                                                       | Override default submit handler                                                                                                                     |
| `onPostSubmit`     | `(dataId, { values }) => void`                                               | Get `dataId` of submitted form data                                                                                                                 |
| `confirm`          | `boolean \| { title: ReactElement, description: ReactElement }`              | Show confirm dialog or use object for other messages. Default: `true`                                                                               |
| `axios`            | `axios => void`                                                              | Get access to API client's axios instance e.g. to set defaults                                                                                      |
| `dateFnsLocale`    | `Locale` from `date-fns`                                                     | Examples:<br />`import useDateFnsLocale from '@visma/react-app-locale-utils/lib/useDateFnsLocale.js';`<br />`import { fi } from 'date-fns/locale';` |
| `children`         | `ReactElement`                                                               | Override default submit button. Set `<></>` (empty React Frament) to render nothing.                                                                |
| `review`           | `boolean`                                                                    | Show review after the form has been submitted. Default: `true`                                                                                      |
| `forceReview`      | `boolean`                                                                    | Show review directly. Default: `false`                                                                                                              |
| `reviewProps`      | `{ actions: ReactNode }`                                                     | Additional action buttons                                                                                                                           |
| `confirmComponent` | `component`                                                                  | [Customize](#customize)                                                                                                                             |

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

## Customize

### Confirm dialog (`confirmComponent`)

Example:

```js
import {
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import produce, { original } from 'immer';
import { FormattedMessage, useIntl } from 'react-intl';

export function CustomConfirm({ config, formData, children }) {
  const intl = useIntl();

  // children, the original dialog, is readonly – use produce from immer to make deep immutable changes.
  return produce(children, (children) => {
    if (config.meta?.showScoreOnPreview) {
      children.props.children.splice(
        2,
        0,
        <DialogContent>
          <DialogContentText>
            <FormattedMessage
              defaultMessage="Vastauksesi antavat sinulle {score} pistettä."
              values={{
                score: Math.ceil(Math.random() * config.meta.maxScore),
              }}
            />
          </DialogContentText>
        </DialogContent>
      );
    }

    // Reverse dialog children order 🤪
    children.props.children.reverse();

    // Reverse dialog action button order
    children.props.children
      .find((element) => element && original(element)?.type === DialogActions)
      ?.props.children.reverse();

    // If set, override consent message
    const consentElement = children.props.children.find(
      (element) => element?.key === 'consent'
    );
    if (consentElement) {
      consentElement.props.children.props.label = intl.formatMessage({
        defaultMessage:
          'Kyllä, haluan lähettää tiedot ja osallistua palkinnon arvontaan 🏆',
      });
    }
  });
}
```

## Load library dynamically

1. Call `init` from `@visma/formula/lib/dll` before using the API:

   ```js
   import { init } from '@visma/formula/lib/dll';
   import App from 'components/App';
   import React from 'react';
   import ReactDOM from 'react-dom';

   async function main() {
     await init('https://example.com/formula');

     ReactDOM.render(
       <React.StrictMode>
         <App />
       </React.StrictMode>,
       document.getElementById('root')
     );
   }

   main();
   ```

2. Import the API from `@visma/formula/lib/dll`. Note that all components and hooks are available only using the default export:

   ```js
   import DLL from '@visma/formula/lib/dll';

   <DLL.Formula
     axios={(axios) => {
       axios.defaults.baseURL = 'https://example.com/formula/api';
       axios.defaults.headers.common.Authorization = 'Bearer <token>';
     }}
     id="1"
   />;
   ```
