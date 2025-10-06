import React, { useState, useEffect } from 'react';

import '../cs/styles.css';

import { Skeleton } from '@mui/material';
import { FaLock, FaLockOpen } from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";

import { RiBattery2ChargeLine } from "react-icons/ri";

const basic_fill = 'yellow';

function stateToColor(state, available=true, reserved=false){
    if (!available) return 'darkgrey'   //Серый — ячейка заблокирована (неактивна)
    if (reserved & state === 'charging') return '#228B22'   //Жёлтый — ячейка забронирована
    if (reserved) return '#663399'
    switch (state) {
        case "ready": return basic_fill;
        case "disabled": return 'grey';
        case "charging": return '#4169E1';
        default: return basic_fill; //empty
    }
}

function PowerCell({url, onDisplayDetails, setCellApiUrl, update, onUpdated}) {
    const [color, setColor] = useState(basic_fill);
    const [status, setStatus] = useState('disabled');
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState(false);
    const [charging, setCharging] = useState(false)
    const [charge, setCharge] = useState(null)
    const [available, setAvailable] = useState(false)
    const [reserved, setReserved] = useState(false)

    useEffect(() => {
            fetch(url)  // Replace with your config endpoint
            .then(response => response.json()
            .then(data => {
                setStatus(data.status)
                setAvailable(data.available)
                setReserved(data.reserved)
                setCharge(data.charge)
                setOpened(data.opened)
                setColor(stateToColor(data.status, data.available, data.reserved))
                setCharging(data.status === 'charging');
                onUpdated();
            })
            .finally(setLoading(false))
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
            onClick={available ? handleClick : null}
            style={{backgroundColor: `${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
        {available ? <>
            <span className='element centered'>{reserved ? <IoTimerOutline /> : null} {opened ? <FaLockOpen/> : <FaLock/>}</span>
            {charging ? <span className='element centered'><RiBattery2ChargeLine className='blinking-element' /> {charge}%</span> : null}
         </>
         : null}
        
        </div>
    );
}



export default PowerCell;