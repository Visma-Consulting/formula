import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@mui/icons-material/Launch';
import { merge } from 'lodash';
import Markdown from 'markdown-to-jsx';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme =>({
  root: {
    fontSize: '0.8em',
    marginLeft: '0.3em',
  },
  link: {
    '&:visited': {
      color: theme.palette.type === 'dark' ? '#FC69DC' : '#AB0386',
    },
    color: theme.palette.type === 'dark' ? '#1FA5FF' : theme.palette.primary,
  }
}));

const Anchor = (props) => {
  const classes = useStyles();

  return (
    <a target="_blank" rel="noopener noreferrer nofollow" {...props}>
      {props.children}
      <LaunchIcon className={classes.root} />
    </a>,
      <Link target="_blank" rel="noopener noreferrer nofollow" {...props} className={classes.link}>
        {props.children}
        <LaunchIcon className={classes.link} />
      </Link>
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
              Link: Anchor,
            },
          },
        },
        props
      )}
    >
      {props.children.replace(/\\/g, '\\\\').replace('\\*', '*')}
    </Markdown>
  ) : null;
