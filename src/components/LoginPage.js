import {Button, Stack} from '@mui/material';
import {makeStyles} from '@mui/styles'
import CloudentityAuth from '@cloudentity/auth';
import authConfig from '../config/authConfig';
import {AppHeader, AppFooter} from './AppHeaderAndFooter'

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  mainSection: {
    flexGrow: 1
  }
});

const LoginPage = ({auth}) => {
  const classes = useStyles();

  const handleAuth = () => {
    const scopes = 'all';
    const cloudentity = new CloudentityAuth({...authConfig, ...scopes});
    cloudentity.authorize();
  };

  const buttonOnClick = () => {
    handleAuth();
  }

  return (
    <div className={classes.root} >
      <AppHeader />
      <Stack
        className={classes.mainSection}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h1>Let's get you in there!</h1>
        <Button className="AuthenticateButton" variant="contained" onClick={() => buttonOnClick()}>Authenticate</Button>
      </Stack>
      <AppFooter />
    </div>
  );
}

export default LoginPage;
