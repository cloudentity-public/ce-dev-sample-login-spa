import { Navigate } from 'react-router-dom';

const Login = ({auth, handleLogin}) => {
  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && (
        <div>
          <h1>Welcome!</h1>
          <button onClick={handleLogin}>
            Please log in.
          </button>
        </div>
      )}
      {auth && <Navigate to='/profile' />}
    </div>
  );
};

export default Login;
