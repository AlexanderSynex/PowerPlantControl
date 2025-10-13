
import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract the 'token' parameter
  const auth_url = `${import.meta.env.VITE_API_HOST}/api/auth?token=${token}`;
  useEffect(() => {
    window.history.replaceState(null, '', '/auth');
    if (token === null) navigate(`/`, {replace: true})
    fetch(auth_url)
    .then(response => response.json()
      .then(data => {
        console.log(data)
        if (data.valid) {
          navigate(`/?session=${data.cred}`, {replace: true});
          return;
        }
        navigate(`/`, {replace: true});
        
    }
    ));
  }, [token, navigate]);

  return <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>

}