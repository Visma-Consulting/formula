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

### Use external config, prefill some fields

```js
import Formula from '@visma/formula';

<Formula
  axios={(axios) => {
    axios.defaults.baseURL = 'https://example.com/formula/api';
    axios.defaults.headers.common.Authorization = 'Bearer <token>';
  }}
  id="1"
  // Assuming form has at least a formGroup with key `customer`, containing
  // fields with keys `firstName` & `lastName`.
  formData={useMemo(
    () => ({
      customer: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }),
    [user]
  )}
/>;
```

## Components

### `<Formula>`

#### Props

One of `config`, `id` or `dataId` is required. Rest are optional.

| Name                                                                           | Type                                                                               | Description                                                                                                                                         |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`                                                                       | [Form](https://visma-consulting.github.io/formula/docs/interfaces/Form.html)       | Form config                                                                                                                                         |
| `formData`                                                                     | `any`                                                                              | Optional, prefilled form data. Ensure the reference does not change undesirably, e.g. using `useMemo`.                                              |
| `id`                                                                           | `string`                                                                           | External form config id                                                                                                                             |
| `dataId`                                                                       | `string`                                                                           | Resume editing                                                                                                                                      |
| `onPreSubmit`                                                                  | `async (args: Args, event: SubmitEvent) => void \| boolean \| [Args, SubmitEvent]` | Run code before submit. Falsy return value prevents the submit. Return `true` or modified args to submit.                                           |
| `onSubmit`                                                                     | `({ values }) => void`                                                             | Override default submit handler                                                                                                                     |
| `onPostSubmit`                                                                 | `(dataId, { values }) => void`                                                     | Get `dataId` of submitted form data                                                                                                                 |
| `confirm`                                                                      | `boolean \| { title: ReactElement, description: ReactElement }`                    | Show confirm dialog or use object for other messages. Default: `true`                                                                               |
| `axios`                                                                        | `axios => void`                                                                    | Get access to API client's axios instance e.g. to set defaults                                                                                      |
| `dateFnsLocale`                                                                | `Locale` from `date-fns`                                                           | Examples:<br />`import useDateFnsLocale from '@visma/react-app-locale-utils/lib/useDateFnsLocale.js';`<br />`import { fi } from 'date-fns/locale';` |
| `children`                                                                     | `ReactElement`                                                                     | Override default submit button. Set `<></>` (empty React Frament) to render nothing.                                                                |
| `review`                                                                       | `boolean`                                                                          | Show review after the form has been submitted. Default: `true`                                                                                      |
| `forceReview`                                                                  | `boolean`                                                                          | Show review directly. Default: `false`                                                                                                              |
| `reviewProps`                                                                  | `{ actions: ReactNode }`                                                           | Additional action buttons                                                                                                                           |
| `confirmComponent`, `previewForm`, `previewField`, `reviewForm`, `reviewField` | `component`                                                                        | [Customize](#customize)                                                                                                                             |

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

### List forms

```js
import { useForms } from '@visma/formula';

function ListForms() {
  const forms = useForms({ status: 'published', visibility: 'public' });
  // ...
}
```

### Form config details

```js
import { useForm } from '@visma/formula';

function FormTitle({ id }) {
  const form = useForm(id);

  return <h1>{form.title}</h1>;
}
```

### Intercept built-in submit function

```js
import { Formula, useMutations } from '@visma/formula';
// ...
const { submit } = useMutations();

<Formula
  onSubmit={async (...args) => {
    try {
      return await submit(...args);
    } catch (error) {
      logger(error);
      throw error;
    }
  }}
  // ...
/>;
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
    const dialogContentElement = children.props.children.find(
      (element) => element && original(element)?.type === DialogContent
    );

    if (config.meta?.showScoreOnPreview && dialogContentElement) {
      dialogContentElement.props.children.splice(
        2,
        0,
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Vastauksesi antavat sinulle {score} pistettä."
            values={{
              score: Math.ceil(Math.random() * config.meta.maxScore),
            }}
          />
        </DialogContentText>
      );
    }

    // Reverse dialog children order 🤪
    children.props.children.reverse();

    // Reverse dialog action button order
    children.props.children
      .find((element) => element && original(element)?.type === DialogActions)
      ?.props.children.reverse();

    // If set, override consent message
    const consentElement = dialogContentElement?.props.children.find(
      (element) => element?.key === 'consent'
    );
    if (consentElement) {
      consentElement.props.label = intl.formatMessage({
        defaultMessage:
          'Kyllä, haluan lähettää tiedot ja osallistua palkinnon arvontaan 🏆',
      });
    }
  });
}
```

### Preview (`previewForm`) & Review Form (`reviewForm`)

Example meta config:

```json
{
  "form": [
    {
      "key": "showTotalScoreInReviewForProfessional",
      "type": "boolean",
      "title": "Näytä kokonaispisteet yhteenvedossa ammattilaiselle"
    }
  ],
  "choice": [
    {
      "key": "score",
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "title": "Pisteet",
      "help": "Tämän vastausvaihtoehdon antamat pisteet"
    }
  ]
}
```

Example component:

```js
import produce from 'immer';

export function CustomReviewForm({ formData, children, uiSchema }) {
  const { element } = uiSchema['ui:options'];
  if (
    element.meta.showTotalScoreInReviewForProfessional
    // && user is professional
  ) {
    const totalScore = (function recur(elements) {
      return elements.reduce((totalScore, element) => {
        if (element.type === 'formGroup') {
          return totalScore + recur(element.elements);
        }
        if (element.type === 'select') {
          const choice = element.choices.find(
            (choice) => choice.enum === formData[element.key]
          );
          const score = choice.meta.score ?? 0;
          return totalScore + score;
        }
        return totalScore;
      }, 0);
    })(element.elements);

    return produce(children, (children) => {
      children.splice(
        2,
        0,
        <FormattedMessage
          defaultMessage="Kokonaispisteet: {totalScore}"
          values={{ totalScore }}
        />
      );
    });
  }

  return children;
}
```

### Preview (`previewField`) & Review Field (`reviewField`)

Example:

```js
import produce from 'immer';
import { sortBy } from 'lodash';

export function CustomPreviewField({ formData, uiSchema, children }) {
  const dataElement = children[1];

  // children, the original field, is readonly – use produce from immer to make deep immutable changes.
  return produce(children, (children) => {
    if (uiSchema['ui:options'].element.meta.showScoreOnPreview) {
      const highlight = sortBy(
        uiSchema['ui:options'].element.meta.highlightColors,
        ['scoreGreaterThan']
      )
        .reverse()
        .find(({ scoreGreaterThan }) => scoreGreaterThan < formData);

      if (highlight) {
        children[1] = (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1 1' }}>{dataElement}</div>
            <div
              style={{
                height: '1.2rem',
                width: '1.2rem',
                color: highlight.color,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        );
      }
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
