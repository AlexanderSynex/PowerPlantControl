import { useEffect, useState, useRef } from 'react'
import reactLogo from '../assets/react.svg'
import '../cs/styles.css'

import { HiOutlineMap } from "react-icons/hi";

import PowerPlant from './PowerPlant'

import { Container, Dialog, IconButton, CircularProgress } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';

import { NewUserNotification, 
         CloseDoorNotification, 
         CrateOpenNotification, 
         ReservedOpenFailureNotification } from './Notifications'
import { PlantInfoDialog, MapPlantSelectDialog } from './Dialogs';

import robustWebsocket from 'robust-websocket';

function LocationSelector({setOpenMaps}) {
  const [location, setLocation] = useState("СПб")

  return (<div className='app-header location-info'>
    <Tooltip title="Выбрать станцию">
      <IconButton style={{color: "white"}} onClick={() => {setOpenMaps(true)}}><HiOutlineMap/>
      </IconButton>
    </Tooltip>
  </div>)
}


function AppTitle({setOpenMaps}) {
  return (
  <div className='element app-header'>
    <div className='app-name'>
      <img src={reactLogo} className="App-logo" alt="logo" />
        Зарядная станция
    </div>
    <LocationSelector
      setOpenMaps={setOpenMaps}
    />
  </div>)
}

function isServerEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "server";
}


// const backend_entrypoint = 'http://192.168.31.25:8000'

const backend_entrypoint = 'http://192.168.0.112:8000'

export default function App() {
  const [clientId, _] = useState(
    Math.floor(new Date().getTime() / 1000)
  );

  const [apiUrl, setApiUrl] = useState(null);
  const [socketUrl, setSocketUrl] = useState(null);
  const socket = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [currentCell, setCurrentCell] = useState(null);
  const [reloadId, setReloadId] = useState(null);

  const [openPlantSuccess, setOpenPlantSuccess] = useState(false)
  const [openOpenedWarning, setOpenOpenedWarning] = useState(false)

  const [openNewUserInfo, setOpenNewUserInfo] = useState(true)
  const [openDetails, setOpenDetails] = useState(false)
  const [openMaps, setOpenMaps] = useState(false)
  
  const [openedCrates, setOpenedCrates] = useState([])

  const open_plant = (id) => {
    socket.current.send(JSON.stringify({
      user: clientId,
      action: "open",
      plant: id
    }))
  }

  useEffect(() => {
        socket.current = new robustWebsocket(`${backend_entrypoint}/ws/${clientId}`);
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
              let plant = data.plant;
              setReloadId(plant);
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
    }, []);

  useEffect(() => {
        fetch(backend_entrypoint)  // Replace with your config endpoint
        .then(response => response.json()
        .then(data => {
            setApiUrl(data.api);
            setSocketUrl(data.socket);
            setLoading(false);
        })
        .catch(error => console.error('Error fetching config:', error)));
    }, []);

  

  const showDetails = () => setOpenDetails(true);

  if (loading) return <Container>
    <CircularProgress />
  </Container>
  
  return (
    <>
    <div className="App">
      <header>
        <AppTitle
          setOpenMaps={()=>{setOpenMaps(true)}}
        />
      </header>
      <main>
      <div className='App-body'>
        <PowerPlant
          apiUrl={apiUrl}
          setCellApiUrl={setCurrentCell}
          onDisplayDetails={showDetails}
          reloadId={reloadId}
        />
      </div>
      </main>

      <CrateOpenNotification 
        open={openPlantSuccess}
        onClickClose={()=>{setOpenPlantSuccess(false)}}
      />

      <NewUserNotification 
        open={openNewUserInfo}
        onClickClose={() => {setOpenNewUserInfo(false)}}
        clientId={clientId}
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
        open={openMaps}
        onClickClose={() => setOpenMaps(false)}
      />
    </div>
    </>
  )
}
