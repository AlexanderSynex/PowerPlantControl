import { useEffect, useState, useRef } from 'react'
import reactLogo from '../assets/react.svg'
import '../cs/styles.css'

import { HiOutlineMap } from "react-icons/hi";

import PowerPlant from './PowerPlant'

import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'

import Tooltip from '@mui/material/Tooltip';

import { CloseDoorNotification, 
         CrateOpenNotification, 
         ReservedOpenFailureNotification } from './Notifications'
import { PlantInfoDialog, MapPlantSelectDialog } from './Dialogs';

function AppTitle({setOpenMaps, address}) {
  return (
  <AppBar sx={{ position: 'static', py: 1}}>
    <Box sx={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src={reactLogo} className="App-logo" alt="logo" />
        <div>
          <Typography sx={{ flex: 1 }} variant="h5" component="div">
            Зарядная станция
          </Typography>
          <Typography variant="caption" component="div" sx={{ lineHeight: 1, opacity: 0.8 }}>
            {address}
          </Typography>
        </div>
      </Box>
      <Tooltip title="Выбрать станцию">
      <IconButton 
        color="inherit" 
        onClick={() => { setOpenMaps(true) }}
      >
        <HiOutlineMap />
      </IconButton>
    </Tooltip>
    </Box>
  </AppBar>)
}

function isServerEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "server"; 
}
const backend_entrypoint = import.meta.env.VITE_API_HOST;

export default function App() {
  const [clientId, _] = useState(
    Math.floor(new Date().getTime() / 1000)
  );

  const [address, setAddress] = useState(null);

  const [apiUrl, setApiUrl] = useState(null);
  const [socketUrl, setSocketUrl] = useState(null);
  const [mapsUrl, setMapsUrl] = useState(null)
  const socket = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentCell, setCurrentCell] = useState(null);
  const [update, setUpdate] = useState(false);

  const [openPlantSuccess, setOpenPlantSuccess] = useState(false)
  const [openOpenedWarning, setOpenOpenedWarning] = useState(false)

  const [openNewUserInfo, setOpenNewUserInfo] = useState(true)
  const [openDetails, setOpenDetails] = useState(false)
  const [openMaps, setOpenMaps] = useState(false)
  
  const [openedCrates, setOpenedCrates] = useState([])

  const onUpdated = () => setUpdate(false)

  const open_plant = (id) => {
    socket.current.send(JSON.stringify({
      user: clientId,
      action: "open",
      plant: id
    }))
  }

  useEffect(() => {
        socket.current = new WebSocket(`${backend_entrypoint}/ws/${clientId}`);
        socket.current.onopen = event => {
          socket.current.send(JSON.stringify({
            user: clientId,
            action: "connect"
          })) 
        };
        socket.current.onmessage = event => {
          console.log(event)
          if (isServerEvent(event)) {
            let data = JSON.parse(event.data);
            console.log(data)
            let action = data.action;
            if (action === 'update') {
              setUpdate(true)
              if (data.who === `${clientId}`) {
                setOpenPlantSuccess(true);
              }
            }

            if (action === 'notify_close') {
              if (data.who === `${clientId}`) {
                setOpenedCrates(data.plant);
                setOpenOpenedWarning(true);
              }
            }

          }
        };
        socket.current.onclose = event => {};

        const wsCurrent = socket.current;

        return () => {
            wsCurrent.close();
        };
    }, [socket]);

  useEffect(() => {
        fetch(backend_entrypoint)  // Replace with your config endpoint
        .then(response => response.json()
        .then(data => {
            setApiUrl(data.api);
            setSocketUrl(data.socket);
            setMapsUrl(data.locations)
            setAddress(data.address);
            setLoading(false);
        })
        .catch(error => console.error('Error fetching config:', error)));
    }, []);

  

  const showDetails = () => setOpenDetails(true);

  if (loading) return <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={loading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  
  

  return (
    <>
      <header>
        <AppTitle
          setOpenMaps={()=>{setOpenMaps(true)}}
          address={address}
        />
      </header>
      <main>
        <div className='App App-body'>
          <PowerPlant
            apiUrl={apiUrl}
            setCellApiUrl={setCurrentCell}
            onDisplayDetails={showDetails}
            update={update}
            onUpdated={onUpdated}
          />
        </div>
      </main>

      <CrateOpenNotification 
        open={openPlantSuccess}
        onClickClose={()=>{setOpenPlantSuccess(false)}}
      />

      <CloseDoorNotification
        open={openOpenedWarning}
        onClickClose={() => {setOpenOpenedWarning(false)}}
        doors={openedCrates}
       />

      <PlantInfoDialog 
        open={openDetails}
        cell={currentCell}
        onClickClose={() => setOpenDetails(false)}
        onPlantOpen={open_plant}
      />

      <MapPlantSelectDialog 
        url={mapsUrl}
        open={openMaps}
        onClickClose={() => setOpenMaps(false)}
      />
    </>
  )
}
