import { useState, useEffect } from "react";

import "../cs/styles.css"
import PowerLayer from "./PowerLayer";
import { Backdrop, CircularProgress } from "@mui/material";

function PowerPlant({ apiUrl, onDisplayDetails, setCellApiUrl, update, onUpdated }) {
  const [layers, setLayers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl)  // Replace with your config endpoint
      .then(response => response.json()
        .then(data => {
          console.log(data)
          setLayers(data?.layers);
          setLoading(false);
        })
        .catch(error => console.error('Error fetching config:', error)));
  }, []);

  if (loading) return <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={loading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>;
  return (
    <div className="centered plant-container">
      {layers.map((layerApi, i) => (
        <PowerLayer
          key={i}
          url={layerApi}
          onDisplayDetails={onDisplayDetails}
          setCellApiUrl={setCellApiUrl}
          update={update}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  )

}

export default PowerPlant;