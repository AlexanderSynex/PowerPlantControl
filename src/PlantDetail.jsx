import React, { useState, useEffect, act } from "react";

import "./styles.css"

function stateMessage(state) {
    switch (state) {
        case "ready": return 'Заряжена';
        case "disabled": return 'Отключена';
        case "charging": return 'Заряжается';
    }
    return 'Свободна'; //empty
}

function ControlGroup({isEmpty, open_url, onClickClose}) {

    const openDoor = () => {
        fetch(open_url,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then((responce) => {
                alert("Подтвердите завершение действия")
                onClickClose();
            })
    };

    if (isEmpty) return (<div>
        <button
            className='element control'
            onClick={()=>openDoor()}>Поставить на зарядку</button>
    </div>)
    
    return <button
        className='element control'
        onClick={()=>openDoor()}>Забрать аккумулятор</button>
}

function PlantDetail({url, onClickClose}) {
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const [charge, setCharge] = useState(0);
    const [status, setStatus] = useState(null);
    const [reserved, setReserved] = useState(false);
    const [empty, setEmpty] = useState(true);
    const [openUrl, setOpenUrl] = useState(null)

    useEffect(() => {
            fetch(url)  // Replace with your config endpoint
            .then(response => response.json()
            .then(data => {
                setStatus(data.status);
                setId(data.id);
                setCharge(data.charge);
                setLoading(false);
                setOpenUrl(data.open_url)
            })
            .catch(error => console.error('Error fetching plant details:', error)));
        }, []);

    if (loading) return <div>Loading details...</div>

    return <div className="element">
        <h3>Зарядная ячейка №{id + 1}</h3>
        <div>
            <p>
            {reserved ? "Ячейка зарезервирована" : ""}
            Состояние: <b>{stateMessage(status)}</b><br/>
            Заряд: <b>{charge}%</b>
            </p>
        </div>
            {
            reserved ?
                null :
                <ControlGroup
                    onClickClose={onClickClose}
                    open_url={openUrl}
                    isEmpty={status == 'empty'}
                />
            }
    </div>
}

export default PlantDetail;