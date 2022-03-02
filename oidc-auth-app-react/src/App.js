import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';

import CloudentityAuth from '@cloudentity/auth';
import authConfig from './authConfig';
import { useAuth } from './auth';

function App() {
  const cloudentity = new CloudentityAuth(authConfig);
  const [authenticated] = useAuth(cloudentity);

  function authorize () {
    cloudentity.authorize();
  };

  function clearAuth () {
    cloudentity.revokeAuth()
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
      });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login auth={authenticated} handleLogin={authorize} />} />
          <Route path="profile" element={<Profile auth={authenticated} handleLogout={clearAuth} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
