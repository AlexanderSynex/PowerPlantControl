import React, { useState, useEffect } from 'react';

import '../cs/styles.css';

import { Skeleton } from '@mui/material';
import { FaLock, FaLockOpen } from "react-icons/fa";

const basic_fill = 'lightgrey';

function stateToColor(state) {
    switch (state) {
        case "ready": return 'green';
        case "disabled": return 'grey';
        case "charging": return 'orange';
        default: return basic_fill; //empty
    }
}

function PowerCell({url, onDisplayDetails, setCellApiUrl, reloadId}) {
    const [color, setColor] = useState(basic_fill);
    const [status, setStatus] = useState('disabled');
    const [loading, setLoading] = useState(true);
    const [withDoor, setWithDoor] = useState(false);
    const [opened, setOpened] = useState(false);

    useEffect(() => {
            fetch(url)  // Replace with your config endpoint
            .then(response => response.json()
            .then(data => {
                setStatus(data.status)
                setColor(stateToColor(data.status))
                setWithDoor(data.with_door)
                setOpened(data.opened)
                setLoading(false);
            })
            .catch(error => console.error('Error fetching layer config:', error)))
        }, [color, status,reloadId]);

    const handleClick = () => {
        setCellApiUrl(url);
        onDisplayDetails();
    };

    if (loading) return <Skeleton animation="wave" />

    return (
        <div 
            className='element plant-cell' 
            onClick={handleClick}
            style={{backgroundColor: `${color}`}}
            >
        {opened ? <FaLockOpen/> : <FaLock/>}<br/>
        {withDoor ? "Doored" : ""}
        
        </div>
    );
}



export default PowerCell;