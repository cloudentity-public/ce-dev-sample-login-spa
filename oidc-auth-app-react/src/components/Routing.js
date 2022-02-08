import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'

import CloudentityAuth from '@cloudentity/auth';
import authConfig from '../config/authConfig';
import { useAuth } from '../services/auth';

const Routing = () => {
  const navigate = useNavigate();
  const cloudentity = new CloudentityAuth(authConfig);
  const [authenticated] = useAuth(cloudentity);
  const accessTokenRaw = localStorage.getItem(authConfig.accessTokenName);
  const auth = authenticated && accessTokenRaw;

  function clearAuth() {
    cloudentity.revokeAuth()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        navigate('/');
      });
  }

  return (
    <Routes>
      <Route path='/' element={!auth
        ? <LoginPage auth={auth} />
        : <Navigate to='/dashboard' /> } />
      <Route path='/dashboard' element={<DashboardPage auth={auth} onLogout={clearAuth} />} />
    </Routes>
  );
}

export default Routing;
