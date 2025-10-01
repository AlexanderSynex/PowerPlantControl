import { useEffect, useState, useRef } from 'react'
import reactLogo from '../assets/react.svg'
import '../cs/styles.css'

import { HiOutlineMap } from "react-icons/hi";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import PowerPlant from './PowerPlant'

import { Snackbar, Dialog, IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import PlantDetail from './PlantDetail';


function LocationSelector() {
  const [location, setLocation] = useState("СПб")

  return (<div className='location-info'>
    <Tooltip title="Выбрать станцию">
      <IconButton><HiOutlineMap/>
      </IconButton>
    </Tooltip>
  </div>)
}


function AppTitle({userId}) {
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
        <Alert severity="warning">
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
    </div>
    </>
  )
}
