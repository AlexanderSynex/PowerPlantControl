import React, { useState, useEffect } from "react";

import "../cs/styles.css"

import { Button, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'

function stateMessage(state) {
  switch (state) {
    case "ready": return 'Заряжена';
    case "disabled": return 'Отключена';
    case "charging": return 'Заряжается';
  }
  return 'Свободна'; //empty
}

function PlantDetail({ url, onClickClose, socket }) {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [charge, setCharge] = useState(0);
  const [status, setStatus] = useState(null);
  const [reserved, setReserved] = useState(false);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    fetch(url)  // Replace with your config endpoint
      .then(response => response.json()
        .then(data => {
          setStatus(data.status);
          setId(data.id);
          setCharge(data.charge);
          setLoading(false);
          setReserved(data.reserved)
        })
        .catch(error => console.error('Error fetching plant details:', error)));
  }, []);

  const open_plant = () => {
    socket.send(JSON.stringify({
      action: "open",
      crate: id
    }))
  }

  const handleAcceptClose = () => {
    open_plant()
    onClickClose()
  };

  if (loading) return <div>Loading details...</div>

  return (<div>
    <DialogTitle id="alert-dialog-title">
      {`Зарядная станция ${id + 1}`}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Состояние: <b>{stateMessage(status)}</b>
      </DialogContentText>
      <DialogContentText id="alert-dialog-description">
        Заряд: <b>{charge}%</b>
      </DialogContentText>
      {reserved ?
        <DialogContentText id="alert-dialog-description">
          Ячейка зарезервирована
        </DialogContentText>
        : null
      }
    </DialogContent>
    <DialogActions>
      <Button
        onClick={handleAcceptClose}
        variant='contained'
      >
        Открыть
      </Button>
    </DialogActions>
  </div>)
}

export default PlantDetail;