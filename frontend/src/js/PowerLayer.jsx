import React, { useState, useEffect } from "react";

import "../cs/styles.css"

import PowerCell from "./PowerCell";
import { CircularProgress } from "@mui/material";

function PowerLayer({url, onDisplayDetails, setCellApiUrl, update, onUpdated}) {
    const [batteries, setBatteries] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(url)  // Replace with your config endpoint
        .then(response => response.json()
        .then(data => {
            setBatteries(data.plants);
            setLoading(false);
        })
        .catch(error => console.error('Error fetching layer config:', error)))
    }, []);

    if (loading) return <div className='plant-layer'><CircularProgress/></div>

    return (
        <div className='centered plant-layer'>
            {batteries.map((battery, i) => (
                <PowerCell
                    key={i}
                    url={battery}
                    onDisplayDetails={onDisplayDetails}
                    setCellApiUrl={setCellApiUrl}
                    update={update}
                    onUpdated={onUpdated}
                />
            ))}
        </div>
    )
}

export default PowerLayer;