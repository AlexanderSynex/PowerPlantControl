import React, { useState, useEffect } from 'react';

import '../cs/styles.css';

import { Skeleton } from '@mui/material';
import { FaLock, FaLockOpen } from "react-icons/fa";

import { RiBattery2ChargeLine } from "react-icons/ri";

const basic_fill = 'lightgrey';

function stateToColor(state) {
    switch (state) {
        case "ready": return 'blue';
        case "disabled": return 'grey';
        case "charging": return 'red';
        default: return basic_fill; //empty
    }
}

function PowerCell({url, onDisplayDetails, setCellApiUrl, update, onUpdated}) {
    const [color, setColor] = useState(basic_fill);
    const [status, setStatus] = useState('disabled');
    const [loading, setLoading] = useState(true);
    const [withDoor, setWithDoor] = useState(false);
    const [opened, setOpened] = useState(false);
    const [charging, setCharging] = useState(false)

    useEffect(() => {
            fetch(url)  // Replace with your config endpoint
            .then(response => response.json()
            .then(data => {
                setStatus(data.status)
                setColor(stateToColor(data.status))
                setWithDoor(data.with_door)
                setOpened(data.opened)
                setLoading(false);
                setCharging(data.status === 'charging');
                onUpdated();
            })
            .catch(error => console.error('Error fetching layer config:', error)))
        }, [color, status, update]);
    
    const handleClick = () => {
        setCellApiUrl(url);
        onDisplayDetails();
    };

    if (loading) return <Skeleton animation="wave" />

    return (
        <div 
            className='element centered plant-cell' 
            onClick={handleClick}
            style={{backgroundColor: `${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
        {opened ? <FaLockOpen/> : <FaLock/>}
        {charging ? <RiBattery2ChargeLine /> : null}
        </div>
    );
}



export default PowerCell;