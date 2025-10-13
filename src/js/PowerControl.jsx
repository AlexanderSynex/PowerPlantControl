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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material'

function isServerEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "server";
}

const backend_entrypoint = import.meta.env.VITE_API_HOST;

export default function PowerControl() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session') || null;
  window.history.replaceState({}, '', '/');
  const authorized = sessionId && sessionId !== undefined;

  if (!authorized) return <NoAccess/>

  const [address, setAddress] = useState(null);   // Адрес зарядной станции

  // Объекты для связи
  const mapsUrl = `/api/locations`    //Entry Карты
  const socket = useRef(null);                    //Websocket

  // Текущая открываемая ячейка
  const [currentCell, setCurrentCell] = useState(null);
  
  // Флаги
  const [loading, setLoading] = useState(true);   //Загрузка данных
  const [update, setUpdate] = useState(false);    //Нужно обновляться

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
      user: sessionId,
      action: "open",
      plant: id
    }))
  }

  useEffect(() => {
    fetch('/api/locations')  // Replace with your config endpoint
      .then(response => response.json())
      .then(data => {
        setAddress(data?.current);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  // useEffect(() => {
  //   if (sessionId === null || sessionId === undefined) return;
  //   socket.current = new WebSocket(`wss://${backend_entrypoint}/wss/${sessionId}`);
  //   socket.current.onopen = event => {
      
  //     socket.current.send(JSON.stringify({
  //       user: sessionId,
  //       action: "connect"
  //     }))
  //   };
  //   socket.current.onmessage = event => {
  //     if (isServerEvent(event)) {
  //       let data = JSON.parse(event.data);
  //       let action = data.action;
  //       console.log(data)
  //       if (action === 'update') {
  //         setUpdate(true)
  //         if (data.who === `${sessionId}`) {
  //           setOpenPlantSuccess(true);
  //         }
  //       }
        
  //       if (action === 'expired') {
  //         navigate(0)
  //       }

  //       if (action === 'notify_close') {
  //         if (data.who === `${sessionId}`) {
  //           setOpenedCrates(data.plant);
  //           setOpenOpenedWarning(true);
  //         }
  //       }
  //     }
  //   };
  //   socket.current.onclose = event => {console.log(socket.current);};

  //   return () => {
  //     if (socket.current)
  //       socket.current.close();
  //   };
  // }, [socket.current]);
//https://cybertex.pro/auth?token=ff22b036-98a7-4b91-8055-38f964a4ea6e

  if (loading) return <Backdrop
    sx={() => ({ color: '#fff', zIndex: 1000 })}
    open={loading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>

  return (
    <>
      <header>
        <AppTitle
          setOpenMaps={() => { setOpenMaps(true) }}
          address={address?.address || null}
        />
      </header>
      <main>
        <Box className='App App-body'>
          <PowerPlant
            apiUrl={`/api/entry`}
            setCellApiUrl={setCurrentCell}
            onDisplayDetails={() => setOpenDetails(true)}
            update={update}
            onUpdated={() => setUpdate(false)}
          />
        </Box>
      </main>
{/* 
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
      /> */}
{/* 
      <ConnectionLostNotification
        open={disconnected}
      /> */}
    </>
  )
}
