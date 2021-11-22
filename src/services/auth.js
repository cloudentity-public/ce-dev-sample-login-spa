import {useState, useEffect} from 'react';
import {useSnackbar} from 'notistack';
import authConfig from '../config/authConfig';

export const useAuth = (auth) => {
  const [authenticated, setAuthentication] = useState(null);
  const {enqueueSnackbar} = useSnackbar();

  function removeQueryString() {
    if (window.location.href.split('?').length > 1) {
      window.history.replaceState({}, document.title, window.location.href.replace(/\?.*$/, ''));
    }
  }

  useEffect(() => {
    auth.getAuth().then((res) => {
      if (res) {
        console.log('auth response:', JSON.stringify(res));
        if (res.scope && res.scope.split(' ').length === 1 && res.scope.startsWith('dataset')) {
          window.localStorage.setItem(`${authConfig.accessTokenName}_${res.scope}`, res.access_token);
        } else {
          window.localStorage.setItem(authConfig.accessTokenName, res.access_token);
        }
        removeQueryString();
      }
      setAuthentication(true);
    })
    .catch((_authErr) => {
      setAuthentication(false);
      if (window.location.href.split('?error').length > 1) {
        if (authenticated === false) {
          enqueueSnackbar('The authorization server returned an error', {
            variant: 'error',
          });
        }
      } else {
        removeQueryString();
      }
    });
  });

  return [authenticated];
};