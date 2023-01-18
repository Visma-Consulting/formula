import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: '15%',
    maxHeight: '30px',
    float: 'right',
  },
});

function Image(logoUrl) {
  const classes = useStyles();

  return <img src={logoUrl} alt={'Logo'} className={classes.root} />;
}

export default (config) => (props) => {
  props.schema.title ??= config.useLabel ? config.label : config.logo ?
    <div>
    {config.title}
    {Image(config.logo)}
  </div> : config.title;
};
