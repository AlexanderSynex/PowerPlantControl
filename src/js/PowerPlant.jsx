import React, { useState, useEffect } from "react";

import "../cs/styles.css"
import PowerLayer from "./PowerLayer";

import io from "socket.io-client"

let socket;

export class Crate extends React.Component{
    constructor(props)
    {
        super(props)
        const {dispatch} = this.props
        socket = io.connect('http://192.168.31.25:8000')
        console.dir(socket)
    }
    componentWillUnmount() {
       socket.disconnect()
       alert("Disconnecting Socket as component will unmount")
    }
    render(){
        <div>
            Crate should be there
        </div>
    }
}


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