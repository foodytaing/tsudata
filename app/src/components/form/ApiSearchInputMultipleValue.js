import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'

import axios from "axios";

const ApiSearchInputMultipleValue = (props) => {
    const {
        apiUrl,
        handleChange,
        label,
        type,
        value= [],
        keysOption= ["_id", "name", "description"],
        keySearch= "name",
        limit=7, 
        resetOnDataChange
    } = props

    const alert = useAlert()

    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);



    useEffect(() => {
        setInputValue("");
        setOptions([])
    }, [resetOnDataChange])

    function handleSearchInputChange(e) {
        e.preventDefault();
        const value = e?.target?.value;
        setInputValue(value);
    }

    async function handleGetData(e) {
        e.preventDefault();
        if (!inputValue) {
            return;
        }

        try {
            //const response = await axios.get(`${apiUrl}?${apiUrlQuery}&${keySearch}=${inputValue.toLowerCase()}`);
            const response = await axios.get(apiUrl, { params: {key: keySearch, val: inputValue, type: type }});
            setOptions(response.data);
            
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }  
    }

    function handleAddValue(option) {
        let newValue = []

        if (value.filter(e => e._id === option._id).length) {
            handleDeleteValue(option)
        } else if (value.length < limit) {
            newValue = [...value, {...option}];
            handleChange(newValue);
        }        
    }

    function handleDeleteValue(option) {
        let newValue = [...value]
        handleChange(newValue.filter(function(el) { return el._id !== option._id }));
    }

    return (
        <fieldset>
            <label>{label}</label>
            { value.length < limit ? (
                <>
            <input
                value={inputValue}
                onChange={handleSearchInputChange}
            />
            <button onClick={handleGetData}>Chercher</button>
            </>
            ) : null
}
            
            <ul>
                {
                    Array.isArray(value) && value.map((option, index) => {
                        return (
                            <li key={'search-select_' + index}>
                        {Array.isArray(keysOption) && keysOption.map((key) => {
                            return (
                                <div key={'search-select_' + option._id + '_' + key}>{option[key]}</div>
                            )
                        })}
                         <button onClick={(e) => handleDeleteValue(e, option)}>delete</button>
                        </li>
                        )
                    })
                }
            </ul>
            <ul>
            { value.length < limit ? (
                Array.isArray(options) && options.map((option, index) => {
                    return (
                        <li onClick={() => handleAddValue(option) } key={index}>
                            {value.filter(e => e._id === option._id).length ? 'on' : 'off'}
                            {Array.isArray(keysOption) && keysOption.map((key) => {
                                return (
                                    <div key={option[key]+ '_' +index}>{option[key]}</div>
                                )
                            })}
                        </li>
                    )
                })
            ) : null
            }
            </ul>
        </fieldset>
    );
};

export default ApiSearchInputMultipleValue;