import React from "react";
import { useAlert } from 'react-alert'

const PlayerList = () => {
    const alert = useAlert()
    
    return (
        <>
            <div>PlayerList</div>
            <button
                onClick={() => {
                    alert.show('Oh look, an alert!')
                }}
            >
            Show Alert
            </button>
        </>
    );
};

export default PlayerList;