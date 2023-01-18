import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  image: {
    maxWidth: '15%',
    maxHeight: '100px',
    width: 'inherit',
    height: 'inherit',
    float: 'right',
    objectFit: 'contain'
  },
});

function Image(logoUrl) {
  const classes = useStyles();

  return <img src={logoUrl} alt={'Logo'} className={classes.image} />;
}

export default (config) => (props) => {
  props.schema.title ??= config.useLabel ? config.label : config.logo ?
    <div style={{ overflow: 'hidden' }}>
    {config.title}
    {Image(config.logo)}
  </div> : config.title;
};
