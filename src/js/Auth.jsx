
import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract the 'token' parameter
  const auth_url = `${import.meta.env.VITE_API_HOST}/auth?token=${token || import.meta.env.VITE_AUTH_TOKEN}`;
  useEffect(() => {
    fetch(auth_url)
    .then(response => response.json()
      .then(data => {
        navigate(`/?session=${data.cred}`, {state: {clientId: data.cred}})
    }
    ));
  }, [token]);

  return <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>

}