import { useEffect, useState } from "react";

import List from '@mui/material/List';
import { Box, Dialog, DialogContent, DialogTitle, Typography, ListItem, ListItemText, Container, DialogActions, IconButton, Paper, Toolbar, AppBar } from '@mui/material'

import PlantDetail from './PlantDetail'

import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from '@pbe/react-yandex-maps';

import React from "react";
import { MapSelector } from "./MapSelector";
import { IoCloseOutline } from "react-icons/io5";

import '../cs/styles.css'

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
  useEffect(() => {
    fetch(url)
    .then(response => response.json().then((data) => {
      setPlants(data.locations)
    }));
  },[])

  return (
<Dialog
  fullScreen
  keepMounted
  open={open}
  onClose={onClickClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <AppBar sx={{ position: 'relative' }}>
    <Toolbar>
      <Typography sx={{ flex: 1 }} variant="h5" component="div">
        Карта зарядных станций
      </Typography>
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClickClose}
        aria-label="close"
      >
        <IoCloseOutline />
      </IconButton>
    </Toolbar>
  </AppBar>
  <DialogContent
    sx={{
      overflow: 'hidden',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      p: 0, // Remove padding to use full height
    }}
  >
    {/* Map Container - 50% height */}
    <Box sx={{ 
      height: '50vh', // 50% of viewport height
      width: '100%',
      flexShrink: 0, // Prevent shrinking
    }}>
      <MapSelector
        plants={plants}
      />
    </Box>

    {/* List Container - Remaining height with scroll */}
    <Paper sx={{
      flex: 1, // Take all remaining space
      minHeight: 0, // Important for flex child scrolling
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 0, // Remove border radius for full width
    }}>
      <List 
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          overflowY: 'auto', // Enable vertical scrolling
          overflowX: 'hidden', // Hide horizontal scrollbar
          minHeight: 0, // Important for scrolling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        }}
      >
        {plants.map((plant, id) => (
          <ListItem
            disableGutters
            key={plant.coords}  
            sx={{
              px: 2, // Add horizontal padding
              py: 1.5, // Add vertical padding
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              }
            }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {plant.address}
                </Typography>
              }
              secondary={
                <>
                  <Box 
                    component="span" 
                    sx={{ 
                      color: plant.opened ? '#009d00' : '#ff0000',
                      fontWeight: 'medium',
                    }}
                  >
                    {plant.opened ? `Открыта` : `Закрыта`}
                  </Box>
                  <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                    {plant.work_from} - {plant.work_to}
                  </Box>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  </DialogContent>
</Dialog>
  )
}