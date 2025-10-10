import { useEffect, useState, useRef } from 'react'

import '../cs/styles.css'

import PowerPlant from './PowerPlant'
import AppTitle from './AppTitle'

import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'

import {
  CloseDoorNotification,
  CrateOpenNotification,
} from './Notifications'

import { PlantInfoDialog, MapPlantSelectDialog } from './Dialogs';
import NoAccess from './NoAccess';
import { useSearchParams } from 'react-router-dom';

function isServerEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "server";
}
const backend_entrypoint = import.meta.env.VITE_API_HOST;

export default function PowerControl() {
  const [clientId, setClientId] = useState(null);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session') || null;

  if (!sessionId || sessionId === undefined) return <NoAccess />;

  const [address, setAddress] = useState(null);   // Адрес зарядной станции

  // Объекты для связи
  const [apiUrl, setApiUrl] = useState(null);     //Entry API
  const [mapsUrl, setMapsUrl] = useState(null)    //Entry Карты
  const socket = useRef(null);                    //Websocket

  // Текущая открываемая ячейка
  const [currentCell, setCurrentCell] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  // Уведомления
  const [openPlantSuccess, setOpenPlantSuccess] = useState(false)
  const [openOpenedWarning, setOpenOpenedWarning] = useState(false)

  // Диалоговые окна
  const [openDetails, setOpenDetails] = useState(false)
  const [openMaps, setOpenMaps] = useState(false)

  // Список незакрытых пользователем ячеек
  const [openedCrates, setOpenedCrates] = useState([])

  const open_plant = (id) => {
    if (!socket.current) return;
    socket.current.send(JSON.stringify({
      user: clientId,
      action: "open",
      plant: id
    }))
  }


  useEffect(() => {
    fetch(backend_entrypoint)  // Replace with your config endpoint
      .then(response => response.json())
      .then(data => {
        setApiUrl(data.api);
        setMapsUrl(data.locations)
        setAddress(data.address);
        setLoading(false);
      })
      .then(() => {
        fetch(`${backend_entrypoint}/api/user?session=${sessionId}`)
          .then(response => response.json())
          .then(data => setClientId(data.user))
      })
      .catch(error => console.error('Error fetching config:', error));
  }, [clientId]);

  useEffect(() => {
    if (clientId === null || clientId === undefined) return
    socket.current = new WebSocket(`${backend_entrypoint}/ws/${clientId}?token=${sessionId}`);
    socket.current.onopen = event => {
      socket.current.send(JSON.stringify({
        user: clientId,
        action: "connect"
      }))
    };
    socket.current.onmessage = event => {
      if (isServerEvent(event)) {
        let data = JSON.parse(event.data);
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

        if (action === 'expiried') {
          if (data.who === `${clientId}`) {}
        }
      }
    };
    socket.current.onclose = event => {};

    const wsCurrent = socket.current;

    return () => {
      wsCurrent.close();
    };
  }, [socket, clientId]);


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
          setOpenMaps={() => { setOpenMaps(true) }}
          address={address}
        />
      </header>
      <main>
        <div className='App App-body'>
          <PowerPlant
            apiUrl={apiUrl}
            setCellApiUrl={setCurrentCell}
            onDisplayDetails={() => setOpenDetails(true)}
            update={update}
            onUpdated={() => setUpdate(false)}
          />
        </div>
      </main>

      <CrateOpenNotification
        open={openPlantSuccess}
        onClickClose={() => { setOpenPlantSuccess(false) }}
      />

      <CloseDoorNotification
        open={openOpenedWarning}
        onClickClose={() => { setOpenOpenedWarning(false) }}
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
{/* 
      <ConnectionLostNotification
        open={disconnected}
      /> */}
    </>
  )
}
