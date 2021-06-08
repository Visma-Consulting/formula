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
  /*
  Set false to disable confirm dialog.
  Optionally use object { title, description }.
  */
  confirm
/>;
```

### Load external config

```js
import Formula from '@visma/formula';

// ...

<Formula
  axios={(axios) => {
    axios.defaults.baseURL = 'https://example.com/formula/api';
  }}
  id="1"
  onPostSubmit={(id, { formData }) => console.log(id, formData)}
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
