import { useState, useEffect } from "react";

import { Container, Dialog } from '@mui/material'
import PlantDetail from './PlantDetail'

import { MapSelector } from "./MapSelector";

{/* Dialog. Информация о ячейке */ }
export function PlantInfoDialog({ open, onClickClose, cell, onPlantOpen }) {
  return (
    <Dialog
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
export function MapPlantSelectDialog({ open, onClickClose }) {
  const [plants, setPlants] = useState([]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClickClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <MapSelector/>
    </Dialog>

  )
}