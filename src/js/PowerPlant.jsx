import React, { useState, useEffect } from "react";

import "../cs/styles.css"
import PowerLayer from "./PowerLayer";

function PowerPlant({apiUrl, onDisplayDetails, setCellApiUrl,reloadId}) {
    const [layers, setLayers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(apiUrl)  // Replace with your config endpoint
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