import { useEffect, useState } from "react";

import List from '@mui/material/List';
import Box from '@mui/material/Box'
import { Dialog, DialogContent, Typography, ListItem, ListItemText, IconButton, Paper, Toolbar, AppBar, CircularProgress, Backdrop } from '@mui/material'

import PlantDetail from './PlantDetail'

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
  const [current, setCurrent] = useState([55.753625, 37.625882]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(url)
    .then(response => response.json().then((data) => {
      setPlants(data?.locations)
      setCurrent(data?.current?.coords)
    }))
    .finally(setLoading(false));
  },[])
  if (loading) return <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={loading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  return (
<Dialog
  fullScreen
  open={open}
  onClose={onClickClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <AppBar sx={{ position: 'relative', bgcolor: '#424489' }}>
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
        current={current}
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
            key={plant?.coords}
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
                <Typography variant="subtitle1" fontWeight="bold">
                  {plant?.address}
                </Typography>
              }
              secondary={
                <>
                  <Box 
                    component="span" 
                    sx={{ 
                      color: plant?.opened ? '#009d00' : '#001effff',
                      fontWeight: 'medium',
                    }}
                  >
                    {plant?.opened ? `Доступна` : `Скоро открытие`}
                  </Box>
                  <Box 
                    component="span" 
                    sx={{ 
                      display: 'block', 
                      mt: 0.5 
                  }}>
                    {plant?.work_from} - {plant?.work_to}
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