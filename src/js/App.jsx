import { useEffect, useState, useRef } from 'react'
import reactLogo from '../assets/react.svg'
import '../cs/styles.css'

import { HiOutlineMap } from "react-icons/hi";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import PowerPlant from './PowerPlant'

import { Snackbar, Dialog, IconButton, CircularProgress } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import PlantDetail from './PlantDetail';

import { load } from '@2gis/mapgl';
// import { YMaps } from '@pbe/react-yandex-maps';

function LocationSelector() {
  const [location, setLocation] = useState("СПб")

  return (<div className='app-header location-info'>
    <Tooltip title="Выбрать станцию">
      <IconButton style={{color: "white"}}><HiOutlineMap/>
      </IconButton>
    </Tooltip>
  </div>)
}


function AppTitle() {
  return (
  <div className='element app-header'>
    <div className='app-name'>
      <img src={reactLogo} className="App-logo" alt="logo" />
        Зарядная станция
    </div>
    <LocationSelector/>
  </div>)
}

function isServerEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "server";
}


const backend_entrypoint = 'http://192.168.31.25:8000'

export default function App() {

  const map = new mapgl.Map('map-container', {
      key: 'Your API access key',
      center: [55.31878, 25.23584],
      zoom: 13,
  });

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

  const [messages, setMessages] = useState([])
  
  const [openPlantSuccess, setOpenPlantSuccess] = useState(false)
  const [openOpenedWarning, setOpenOpenedWarning] = useState(false)

  const [openInfo, setOpenInfo] = useState(true)
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
        socket.current = new WebSocket(`${backend_entrypoint}/ws/${clientId}`);
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
              let plant = data.plant;
              setReloadId(plant);
              if (data.who === `${clientId}`) {
                setOpenPlantSuccess(true);
              }
            }

            if (action === 'notify_close') {
              console.log(data)
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
  const hideDetails = () => setOpenDetails(false)

  if (loading) return <CircularProgress />

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
          onDisplayDetails={showDetails}
          reloadId={reloadId}
        />
      </div>
      
      {/* Popup. Успешное открытие */}
      <Snackbar open={openPlantSuccess} autoHideDuration={6000} onClose={() => {setOpenPlantSuccess(false)}}>
          <Alert severity="success" color="warning" onClose={() => {setOpenPlantSuccess(false)}}>
            <AlertTitle>Ячейка открыта</AlertTitle>
              Не забудьте закрыть ячейку
          </Alert>
      </Snackbar>

      {/* Alert. Незакрытые ячейки */}
      <Snackbar
        open={openOpenedWarning}
        onClose={() => {setOpenOpenedWarning(false)}}
        message={`Авторизированы как Пользователь ${clientId}`}
      >
        <Alert severity="warning" color="error">
          <AlertTitle>Закройте дверцы</AlertTitle>
            Дверцы ячеек {openedCrates.map((indexId) => (indexId + 1)).join(', ')} не были закрыты
        </Alert>

      </Snackbar>

      {/* Popup. Информация об авторизации */}
      <Snackbar
        open={openInfo}
        autoHideDuration={3000}
        onClose={() => {setOpenInfo(false)}}
        message={`Авторизированы как Пользователь ${clientId}`}
      />

      {/* Dialog. Информация о ячейке */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <PlantDetail
        url={currentCell}
        onClickClose={hideDetails}
        onOpen={open_plant}
        socket={socket.current}
        />
      </Dialog>

      {/* Карта */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <PlantDetail
        url={currentCell}
        onClickClose={hideDetails}
        onOpen={open_plant}
        socket={socket.current}
        />
      </Dialog>
    </div>
    </>
  )
}
