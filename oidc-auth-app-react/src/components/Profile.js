import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

const Profile = ({auth, handleLogout}) => {
  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};
  const lastLogin = idTokenData.iat ? (new Date(idTokenData.iat*1000)).toLocaleString() : 'N/A';

  console.log(idTokenData, lastLogin, idTokenData.iat);

  const profileItemStyle = {
    display: 'flex',
    justifyContent: 'space-between'
  };

  const profileLabelStyle = {
    fontWeight: 'bold'
  };

  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && <Navigate to='/' />}
      {auth && (
        <div>
          <h1>Welcome, {idTokenData.sub || 'user'}!</h1>
          <h3>
            Your profile info:
          </h3>
          <div style={{marginTop: 20, minWidth: 270}}>
            <div style={profileItemStyle}>
              <div style={profileLabelStyle}>Username:</div>
              <div>{idTokenData.sub}</div>
            </div>
            <div style={profileItemStyle}>
              <div style={profileLabelStyle}>Email:</div>
              <div>{idTokenData.email || 'N/A'}</div>
            </div>
            <div style={profileItemStyle}>
              <div style={profileLabelStyle}>Last login:</div>
              <div>{lastLogin}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{marginTop: 20}}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
