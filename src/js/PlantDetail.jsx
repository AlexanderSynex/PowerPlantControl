import { useState, useEffect } from "react";

import "../cs/styles.css"

import { 
  Button, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  DialogActions,
  CircularProgress,
  Stack} from '@mui/material'


function stateMessage(empty=false, charging=false, available=true){
    if (!available) return 'Отключена';
    if (charging) return 'Заряжается';
    if (!empty) return 'Занята';
    return 'Свободна';
}

function PlantDetail({ url, onClickClose, onOpen, onChargePlant, onStopChargePlant }) {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [charge, setCharge] = useState(0);
  const [power, setPower] = useState(0);
  const [empty, setEmpty] = useState(false);
  const [charging, setCharging] = useState(false);
  const [available, setAvailable] = useState(false);
  const [voltage, setVoltage] = useState(null);
  
  const [reserved, setReserved] = useState(false);
  const [opened, setOpened] = useState(false);
  const [controllable, setControllable] = useState(false)
  const [temperature, setTemperature] = useState(20)

  const [withDoor, setWithDoor] = useState(false);

  useEffect(() => {
    fetch(url)  // Replace with your config endpoint
      .then(response => response.json()
        .then(data => {
          setId(data?.id);
          setCharge(data?.charge);
          setAvailable(data?.available);
          setCharging(data?.charging);
          setTemperature(data?.temp);
          setEmpty(data?.empty);
          setReserved(data?.reserved);
          setPower(data?.power);
          setOpened(data?.opened);
          setVoltage(data?.voltage);
          setWithDoor(data?.with_door);
          setControllable(data?.controllable);
        })
        .finally(() => setLoading(false))
        .catch(error => console.error('Error fetching plant details:', error)));
  }, [charge, temperature, voltage]);

  if (loading) return <CircularProgress color="inherit" />

  return (<div>
    <DialogTitle id="alert-dialog-title">
      {`Зарядная ячейка №${id + 1}`}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Состояние: <b>{stateMessage(empty, charging, available)}</b>
      </DialogContentText>
      {!empty ? <DialogContentText id="alert-dialog-description">
        Заряд: <b>{charge}%</b>
      </DialogContentText> : null}
      {charging && !empty ? 
      <DialogContentText id="alert-dialog-description">
        Мощность: <b>{power} Вт</b>
      </DialogContentText> :
      null}
      {voltage > 0 ? 
      <DialogContentText id="alert-dialog-description">
        Напряжение: <b>{voltage} мВ</b>
      </DialogContentText>
      : null
      }
      <DialogContentText id="alert-dialog-description">
        Температура: <b>{temperature}&deg;C</b>
      </DialogContentText>
      {reserved ?
        <DialogContentText id="alert-dialog-description">
          Ячейка зарезервирована
        </DialogContentText>
        : null
      }
    </DialogContent>
    {opened ? 
    null
    : <DialogActions>
      <Stack direction="column" spacing={1} width="100%">
        <Button
          onClick={() => {
            onOpen(id)
            onClickClose()
          }}
          variant='contained'
          disabled={!controllable || reserved}
        >
          Открыть
        </Button>

        {
          !withDoor && !charging ? <Button
          onClick={() => {
            onClickClose()
            onChargePlant(id)
          }}
          variant='contained'
          disabled={!controllable || reserved || empty}
        >
          Начать зарядную сессию
        </Button> : null
        }

        {
          !withDoor && charging ? <Button
          onClick={() => {
            onClickClose()
            onStopChargePlant(id)
          }}
          variant='contained'
          disabled={!controllable || reserved|| empty}
        >
          Остановить зарядную сессию
        </Button> : null
        }
        </Stack>
      </DialogActions>
    }
  </div>)
}

export default PlantDetail;