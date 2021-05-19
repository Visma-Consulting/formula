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
import { usePublicForms } from '@visma/formula';

function ListForms() {
  const forms = usePublicForms();
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
