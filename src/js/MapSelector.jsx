import Container from '@mui/material/Container';
import List from '@mui/material/List';
import { ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { Paper, Typography } from '@mui/material';

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';


function PlantMap({points}) {
  return (
    <YMaps>
        <Map
          defaultState={{
            center: [59.938886, 30.313838],
            zoom: 9,
            controls: ["zoomControl", "fullscreenControl"],
          }}
          modules={["control.ZoomControl", "control.FullscreenControl"]}
        >
          {points.map((point) => (<Placemark defaultGeometry={point} />))}
        </Map>
      </YMaps>)
}

export function MapSelector() {
  const points=[
          [59.852211, 30.322954],
          [59.938282, 30.365609],
          [59.941562, 30.247963]
        ];
  return (
    <Container>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Зарядные станции
      </Typography>
      <PlantMap
        points={points}
      />
    </Container>)
}