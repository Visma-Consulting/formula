import { merge } from 'lodash';
import Markdown from 'markdown-to-jsx';

export default (props) => (
  <Markdown
    {...merge(
      {
        options: {
          overrides: {
            a: {
              component: 'a',
              props: {
                target: '_blank',
              },
            },
          },
        },
      },
      props
    )}
  />
);
