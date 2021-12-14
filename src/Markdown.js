import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import { merge } from 'lodash';
import Markdown from 'markdown-to-jsx';

const useStyles = makeStyles({
  root: {
    fontSize: '0.8em',
    marginLeft: '0.3em',
  },
});

const Anchor = (props) => {
  const classes = useStyles();

  return (
    <a target="_blank" rel="noopener noreferrer nofollow" {...props}>
      {props.children}
      <LaunchIcon className={classes.root} />
    </a>
  );
};

export default (props) =>
  props.children ? (
    <Markdown
      {...merge(
        {
          options: {
            overrides: {
              a: Anchor,
            },
          },
        },
        props
      )}
    >
      {props.children.replace(/\\/g, '\\\\')}
    </Markdown>
  ) : null;
