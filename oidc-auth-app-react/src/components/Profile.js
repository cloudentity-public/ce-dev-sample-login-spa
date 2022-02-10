import { Navigate } from 'react-router-dom';

const Profile = ({auth, handleLogout}) => {
  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && <Navigate to='/' />}
      {auth && (
        <div>
          <h1>Welcome, { /* we'll dynamically populate this */ 'user' }!</h1>
          <div>
            Your profile info:
          </div>
          <div>
            { /* we'll dynamically populate this */ }
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
