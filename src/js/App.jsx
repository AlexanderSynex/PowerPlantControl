import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import '../cs/styles.css'

import PowerPlant from './PowerPlant'

import { Snackbar } from '@mui/material'

function AppTitle({userId}) {
  return <div className='element app-header'>
      <img src={reactLogo} className="App-logo" alt="logo" />
      <p>
        Зарядная станция
      </p>
  </div>
}

const backend_entrypoint = 'http://192.168.31.25:8000/'

export default function App() {

  const [clientId, setClienId] = useState(
    Math.floor(new Date().getTime() / 1000)
  );

  const [apiUrl, setApiUrl] = useState(null);
  const [socketUrl, setSocketUrl] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [currentCell, setCurrentCell] = useState(null);
  const [reloadId, setReloadId] = useState(null);

  const [messages, setMessages] = useState([])
  
  const [open, setOpen] = useState(true)

  useEffect(() => {
        fetch(backend_entrypoint)  // Replace with your config endpoint
        .then(response => response.json()
        .then(data => {
            setApiUrl(data.api);
            setSocketUrl(data.socket);
            setLoading(false);
        })
        .then(() => {
          const ws = new WebSocket(`${socketUrl}/${clientId}`)
          ws.onopen = event => {
            ws.send(JSON.stringify({
              user: clientId,
              action: "connect"
            }))
          }

          ws.onmessage = e => {
            const message = JSON.parse(e.data);
            setMessages([...messages, message]);
          };
          setSocket(ws)
          return () => ws.close()
        })
        .catch(error => console.error('Error fetching config:', error)));

        
    }, []);

  if (loading) return <div>Loading...</div>

  return (
    <>
    <div className="App">
      <header>
        <AppTitle/>
      </header>
      <div className='App-body'>
        <PowerPlant
          apiUrl={apiUrl}
          setCellApiUrl={setCurrentCell}
          reloadId={reloadId}
        />
      </div>
      
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => {setOpen(false)}}
        message={`Авторизированы как Пользователь #${clientId}`}
      />

    </div>
    </>
  )
}
