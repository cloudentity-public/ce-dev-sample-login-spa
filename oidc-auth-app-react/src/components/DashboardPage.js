import {useState, useEffect} from 'react';
import {Divider, Card, Grid} from '@mui/material';
import {makeStyles} from '@mui/styles'
import AccessTokenDisplay from './AccessTokenDisplay';
import PlanInfoSection from './PlanInfoSection';
import EnrolledMemberSection from './EnrolledMemberSection';
import {AppHeader, AppFooter} from './AppHeaderAndFooter'
import config from '../config/config'
import authConfig from '../config/authConfig';
import jwt from 'jsonwebtoken';
import LogoutIcon from '@mui/icons-material/Logout';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  dashboardHeaderBanner: {
    backgroundColor: 'black',
    display: 'flex'
  },
  dashboardHeaderText: {
    padding: '0px 20px',
    flexGrow: 1,
    color: 'white'
  },
  logoutButton: {
    borderLeft: '1px solid white',
    color: 'white',
    padding: 20,
    '&:hover': {
       backgroundColor: 'red'
    }
  },
  mainSection: {
    flexGrow: 1,
    padding: 10
  },
  cardsSection: {
    marginBottom: 30
  },
  item: {
    border: '1px solid black',
    padding: 10
  },
  sectionDivider: {
    margin: 50
  }
});

const DashboardPage = ({auth, onLogout}) => {
  const classes = useStyles();

  const [enrolledMemberApiData, setEnrolledMemberApiData] = useState(null);
  const [apiCallInProgress, setApiCallInProgress] = useState(false);

  const accessTokenRaw = localStorage.getItem(authConfig.accessTokenName);
  const token = !!auth ? (jwt.decode(accessTokenRaw) || {}) : {};
  const sub = token.sub;
  const tid = token.tid;
  const welcomeMessage = !!accessTokenRaw
      ? `Welcome, user "${sub}" from tenant "${tid}"!`
      : 'No user found';

  useEffect(() => {
    if(!enrolledMemberApiData && !apiCallInProgress && !!sub) {
      setApiCallInProgress(true);

      var headers = {
        'Content-Type': 'application/json'
      };
      var reqBody = {
        'planSponsorNumber': sub
      };

      fetch(config.enrolledMembersApiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(reqBody)
      })
        .then(res => {
          if(res.status === 200) return res.json()
          else return {status: res.status, statusText: res.statusText}
        })
        .then(
          (result) => {
            setEnrolledMemberApiData(result);
            setApiCallInProgress(false);
          },
          (error) => {
            // setErrorString(`${error.name}: ${error.message}`);
            setApiCallInProgress(false);
          }
        );

    }
  }, [enrolledMemberApiData, apiCallInProgress, sub]);

  return (
    <div className={classes.root} >
      <AppHeader />
      <div className={classes.dashboardHeaderBanner} >
        <div className={classes.dashboardHeaderText} >
          <h3>{welcomeMessage}</h3>
        </div>
        <div className={classes.logoutButton} onClick={onLogout}>
          <LogoutIcon />
        </div>
      </div>
      <div className={classes.mainSection} >
        <Grid container spacing={2}  className={classes.cardsSection} >

          <Grid item xs={6}>
            <Card className={classes.item} >
              <h2>Fetch Data On Page Load Example</h2>
              <i> .. This section will not display any data unless wired with a backend service .. </i>
              <EnrolledMemberSection auth={auth} enrolledMemberApiData={enrolledMemberApiData} />
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card className={classes.item} >
              <h2>Fetch Data On Click Example</h2>
              <i> .. This section will not display any data unless wired with a backend service .. </i>
              <PlanInfoSection auth={auth} enrolledMemberApiData={enrolledMemberApiData} />
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card className={classes.item} >
              <h2>Fetch Secure Data on Click Example</h2>
              <i> .. This section will not display any data unless wired with a backend service .. </i>
            </Card>
          </Grid>

        </Grid>

        <Divider />

        <AccessTokenDisplay auth={auth} />

      </div>
      <AppFooter />
    </div>
  );

}

export default DashboardPage;
