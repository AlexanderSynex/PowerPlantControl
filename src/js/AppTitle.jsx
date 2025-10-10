import { AppBar, Box, IconButton, Tooltip, Typography } from "@mui/material"
import { HiOutlineMap } from "react-icons/hi"

import reactLogo from '../assets/react.svg'

export default function AppTitle({ setOpenMaps, address }) {
  return (
    <AppBar sx={{ position: 'static', py: 1 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={reactLogo} className="App-logo" alt="logo" />
          <div>
            <Typography sx={{ flex: 1 }} variant="h5" component="div">
              Зарядная станция
            </Typography>
            <Typography variant="caption" component="div" sx={{ lineHeight: 1, opacity: 0.8 }}>
              {address}
            </Typography>
          </div>
        </Box>
        <Tooltip title="Выбрать станцию">
          <IconButton
            color="inherit"
            onClick={() => { setOpenMaps(true) }}
          >
            <HiOutlineMap />
          </IconButton>
        </Tooltip>
      </Box>
    </AppBar>)
}