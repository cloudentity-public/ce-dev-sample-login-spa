import {makeStyles} from '@mui/styles'

const useStyles = makeStyles({
  root: {
    backgroundColor: 'rgb(41, 47, 61)',
    textAlign: 'center',
    color: 'rgb(28, 137, 249)'
  },
  header: {
    padding: 5
  },
  footer: {
    padding: 10
  },
});

const AppHeader = () => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${classes.header}`}>
      <h1>Cloudentity Sample Login App</h1>
    </div>
  );
};

const AppFooter = () => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${classes.footer}`}>
      Copyright &copy;2021 Cloudentity
    </div>
  );
};

export { AppHeader, AppFooter };
