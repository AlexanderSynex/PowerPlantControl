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

function ControlGroup({isEmpty, url, onClickClose}) {

    const performAction = (action) => {
        fetch(`${url}/${action}`,{
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

    if (!isEmpty) return (<div>
        <button
            class='element control'
            onClick={()=>{performAction('take')}}>Забрать</button>
    </div>)
    
    return <button
        class='element control'
        onClick={()=>{performAction('place')}}>Открыть</button>
}

function PlantDetail({url, onClickClose}) {
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const [charge, setCharge] = useState(0);
    const [status, setStatus] = useState(null);
    const [empty, setEmpty] = useState(true);

    useEffect(() => {
            fetch(url)  // Replace with your config endpoint
            .then(response => response.json()
            .then(data => {
                setStatus(data.status);
                setId(data.id);
                setCharge(data.charge);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching plant details:', error)));
        }, []);

    if (loading) return <div>Loading details...</div>

    return <div class="element">
        <h3>Зарядная ячейка №{id + 1}</h3>
        <div>
            Состояние: <b>{stateMessage(status)}</b><br/>
            Заряд: <b>{charge}%</b>
        </div>
            <ControlGroup
            onClickClose={onClickClose}
            url={url}
            isEmpty={status == 'empty'}/>
    </div>
}

export default PlantDetail;