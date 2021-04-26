## `<Formula>`

```js
import Formula from '@visma/formula';

// ...

<Formula
  axios={(axios) => {
    axios.defaults.baseURL = 'https://example.com/formula/api';
  }}
  id="1"
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
import { useForm, useLocalize } from '@visma/formula';

function FormTitle({ id }) {
  const form = useForm(id);
  const localize = useLocalize();

  return <h1>{localize(form.title)}</h1>;
}
```
