import React, { useState, useEffect } from "react";

import "../cs/styles.css"

import { 
  Button, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  DialogActions,
  CircularProgress, 
  Tooltip} from '@mui/material'


function stateMessage(state) {
  switch (state) {
    case "ready": return 'Заряжена';
    case "disabled": return 'Отключена';
    case "charging": return 'Заряжается';
  }
  return 'Свободна'; //empty
}

function PlantDetail({ url, onClickClose, onOpen }) {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [charge, setCharge] = useState(0);
  const [status, setStatus] = useState(null);
  const [voltage, setVoltage] = useState(null);
  const [reserved, setReserved] = useState(false);
  const [opened, setOpened] = useState(false);
  const [controllable, setControllable] = useState(false)
      

  useEffect(() => {
    fetch(url)  // Replace with your config endpoint
      .then(response => response.json()
        .then(data => {
          setStatus(data?.status);
          setId(data?.id);
          setCharge(data?.charge);
          setReserved(data?.reserved)
          setOpened(data?.opened)
          setVoltage(data?.voltage)
          setControllable(data?.controllable)
        })
        .finally(() => setLoading(false))
        .catch(error => console.error('Error fetching plant details:', error)));
  }, []);

  

  const handleAcceptClose = () => {
    onOpen(id)
    onClickClose()
  };

  if (loading) return <CircularProgress color="inherit" />

  return (<div>
    <DialogTitle id="alert-dialog-title">
      {`Зарядная ячейка №${id + 1}`}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Состояние: <b>{stateMessage(status)}</b>
      </DialogContentText>
      <DialogContentText id="alert-dialog-description">
        Заряд: <b>{charge}%</b>
      </DialogContentText>
      {voltage > 0 ? 
      <DialogContentText id="alert-dialog-description">
        Напряжение: <b>{voltage}%</b>
      </DialogContentText>
      : null
      }
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
        <Button
          onClick={handleAcceptClose}
          variant='contained'
          disabled={!controllable || reserved}
        >
          Открыть
        </Button>
      </DialogActions>
    }
  </div>)
}

export default PlantDetail;