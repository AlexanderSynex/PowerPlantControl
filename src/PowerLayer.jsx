import React, { useState, useEffect } from "react";

import "./styles.css"

import PowerCell from "./PowerCell";

function PowerLayer({url, onDisplayDetails, onSyncCell}) {
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

    if (loading) return <div>Loading layers...</div>

    return (
        <div className='plant-layer'>
            {batteries.map((battery, i) => (
                <PowerCell
                    key={i}
                    url={battery}
                    onDisplayDetails={onDisplayDetails}
                    setCellCurrent={onSyncCell}
                />
            ))}
        </div>
    )
}

export default PowerLayer;