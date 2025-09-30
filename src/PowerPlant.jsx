import React, { useState, useEffect } from "react";

import "./styles.css"
import PowerLayer from "./PowerLayer";

const api_server = "http://192.168.31.25:8000";
const status_api_url = `${api_server}/api/status`

function PowerPlant({onDisplayDetails, setCellApiUrl,reloadId}) {
    const [layers, setLayers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(status_api_url)  // Replace with your config endpoint
        .then(response => response.json()
        .then(data => {
            setLayers(data.layers);
            setLoading(false);
        })
        .catch(error => console.error('Error fetching config:', error)));
    }, [reloadId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="plant-container">
            {layers.map((layerApi, i) => (
                <PowerLayer 
                    key={i}
                    url={layerApi}
                    onDisplayDetails={onDisplayDetails}
                    setCellApiUrl={setCellApiUrl}
                    reloadTrigger={true}
                    reloadId={reloadId}
                />
            ))}
        </div>
    )

}

export default PowerPlant;