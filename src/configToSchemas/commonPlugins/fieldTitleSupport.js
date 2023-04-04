import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  image: {
    maxWidth: '20%',
    maxHeight: '100px',
    width: 'inherit',
    height: 'inherit',
    float: 'right',
  },
});

function Image(logoUrl) {
  const classes = useStyles();

  return <img src={logoUrl} alt={'Logo'} className={classes.image} />;
}

export default (config) => (props) => {
  props.schema.title ??= config.useLabel ? config.label : config.logo ?
    <div style={{ overflow: 'hidden' }}>
      {Image(config.logo)}
    {config.title}
  </div> : config.title;
};
