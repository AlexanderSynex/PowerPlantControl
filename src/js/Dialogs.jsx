import { useEffect, useState } from "react";

import List from '@mui/material/List';
import { Dialog, DialogContent, DialogTitle, Typography, ListItem, ListItemText, Container, DialogActions, IconButton } from '@mui/material'

import PlantDetail from './PlantDetail'

import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from '@pbe/react-yandex-maps';

import React from "react";

{/* Dialog. Информация о ячейке */ }
export function PlantInfoDialog({ open, onClickClose, cell, onPlantOpen }) {
  return (
    <Dialog
      maxWidth={'md'}
      open={open}
      onClose={onClickClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <PlantDetail
        url={cell}
        onClickClose={onClickClose}
        onOpen={onPlantOpen}
      />
    </Dialog>
  )
}


{/* Карта */ }
export function MapPlantSelectDialog({ url, open, onClickClose }) {
  const [plants, setPlants] = useState([]);
  const points=[
          [59.852211, 30.322954],
          [59.938282, 30.365609],
          [59.941562, 30.247963]
        ];
  useEffect(() => {
    fetch(url)
    .then(response => response.json().then((data) => {
      setPlants(data.locations)
    }));
    console.log('Maps url:', url)
  },[])

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClickClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Typography gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Зарядные станции
        </Typography>
      </DialogTitle>
      <DialogContent style={{overflow: 'hidden'}}>
        <YMaps>
        <Map
          defaultState={{
            center: [59.938886, 30.313838],
            zoom: 10,
            }}
          width="100%"
          height="60%"
        >
          {plants.map((point, index) => 
            (<Placemark key={index} defaultGeometry={point.coords} />))
          }
        <ZoomControl />
        <GeolocationControl />
        </Map>
      </YMaps>
      <Container style={{overflow: 'scroll'}}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {plants.map((plant, id) => 
              (<ListItem key={id} alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography >
                      {plant.address}
                    </Typography>
                    
                  }
                  secondary={
                    <React.Fragment>
                      {plant.opened ? `Открыта` : `Закрыта`} {plant.work_from} - {plant.work_to}
                    </React.Fragment>
                  }
                />
              </ListItem>)
            )}
        </List>
      </Container>
      </DialogContent>
    </Dialog>
  )
}