import Markdown from 'markdown-to-jsx';
import * as list from './list';

export default function configToUISchema(config) {
  const {
    alt,
    //autocomplete,
    choicesDisabled,
    content,
    elements,
    placeholder,
    selectWidget,
    url,
    type,
  } = config;

  const converter = {
    body: () => ({
      'ui:field': () => (
        <Markdown
          options={{
            overrides: {
              a: {
                component: 'a',
                props: {
                  target: '_blank',
                },
              },
            },
          }}
        >
          {content}
        </Markdown>
      ),
      'ui:should-update': content,
    }),
    email: () => ({
      'ui:widget': 'email',
    }),
    form: () =>
      Object.fromEntries(
        elements.map((element, index) => [
          element.key ?? String(index),
          configToUISchema(element),
        ])
      ),
    image: () => ({
      'ui:field': () => <img src={url} alt={alt} />,
      'ui:should-update': url,
    }),
    password: () => ({
      'ui:widget': 'password',
    }),
    range: () => ({
      'ui:widget': 'range',
    }),
    select: () => ({
      'ui:placeholder': placeholder,
      'ui:widget': { 0: 'radio' }[selectWidget],
      //'ui:field': autocomplete ? Autocomplete : undefined,
      'ui:enumDisabled': choicesDisabled,
    }),
    textarea: () => ({
      'ui:widget': 'textarea',
    }),
    title: () => ({
      'ui:field': () => <h4>{content}</h4>,
      'ui:should-update': content,
    }),
  }[type];

  if (!converter) {
    return;
  }

  return converter() |> list.uiSchema(config);
}
