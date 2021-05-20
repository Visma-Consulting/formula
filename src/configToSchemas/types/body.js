import Markdown from 'markdown-to-jsx';
import extendType from './_extendType';
import _dummy from './_dummy';

export default extendType(_dummy, ({ content }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => (
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
  );
  props.uiSchema['ui:should-update'] = content;
});
