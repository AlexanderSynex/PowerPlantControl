
import { YMaps, Map, Placemark, ZoomControl } from '@pbe/react-yandex-maps';

const working_plant_color = '#001effff';
const closed_plant_color = '#bbbbbb';

export function MapSelector({ current, plants }) {

  return (
    <YMaps>
      <Map
        defaultState={{
          center: current?.coords || [55.755864, 37.617698],
          zoom: 14,
        }}
        width='100%'
        height="50vh"
      >
        {plants.map((point, index) =>
        (<Placemark
          key={index}
          defaultGeometry={point.coords}
          options={{ iconColor: point.opened ? working_plant_color : closed_plant_color }}
        />))
        }
        <ZoomControl />
      </Map>
    </YMaps>
  )
}