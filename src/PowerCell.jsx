import React, { useState, useEffect } from 'react';

import './styles.css';

const basic_fill = 'lightgrey';

function stateToColor(state) {
    switch (state) {
        case "ready": return 'green';
        case "disabled": return 'grey';
        case "charging": return 'orange';
        default: return basic_fill; //empty
    }
}

function PowerCell({url, onDisplayDetails, setCellCurrent}) {
    const [color, setColor] = useState(basic_fill);
    const [status, setStatus] = useState('disabled');
    const [loading, setLoading] = useState(true)

    const takeApi = `${url}/take`;
    const placeApi = `${url}/place`;

    useEffect(() => {
            fetch(url)  // Replace with your config endpoint
            .then(response => response.json()
            .then(data => {
                setStatus(data.status)
                setColor(stateToColor(data.status))
                setLoading(false);
            })
            .catch(error => console.error('Error fetching layer config:', error)))
        }, [color, status]);

    const handleClick = () => {
        setCellCurrent(url);
        onDisplayDetails();
    };

    if (loading) return <div>Loading</div>

    return (
        <div 
            className='element plant-cell' 
            onClick={handleClick}
            style={{backgroundColor: `${color}`}}
            >
        </div>
    );
}



export default PowerCell;