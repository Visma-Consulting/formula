## `<Formula>` 🏎

# Simple form

```js
import Formula from '@visma/formula';

// ...

<Formula
  config={{
    title: 'Sign in',
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
  onSubmit={({ formData }) => console.log(formData)}
/>;
```

### Load external config + other props

```js
import Formula from '@visma/formula';
import { fi } from 'date-fns/locale';

// ...

<Formula
  axios={(axios) => {
    axios.defaults.baseURL = 'https://example.com/formula/api';
  }}
  id="1"
  // Resume editing
  dataId="123"
  onPostSubmit={(dataId, { formData }) => console.log(dataId, formData)}
  /*
  Disable confirm dialog or use object { title, description } for other
  messages.
  */
  confirm={false}
  dateFnsLocale={fi}
/>;
```

## `<FormulaProvider>`, `<Form>`

```js
import { Form, FormulaProvider } from '@visma/formula';

function App() {
  return (
    <FormulaProvider
      axios={(axios) => {
        axios.defaults.baseURL = 'https://example.com/formula/api';
        axios.defaults.headers.common.Authorization = 'Bearer <token>';
      }}
    >
      <FormExample />
    </FormulaProvider>
  );
}

function FormExample() {
  return <Form id="1" />;
}
```

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
