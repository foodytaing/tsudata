import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'

import FontAwesome from 'react-fontawesome'

import axios from "axios";

export const escapeRegExp = (s) => {
    return s.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

const ApiSearchInputMultipleValue = (props) => {
    const {
        apiUrl,
        handleChange,
        label,
        type,
        value = [],
        keysOption = ["name", "description"],
        keySearch = "name",
        limit = 7,
        resetOnDataChange,
        className = "search-select"
    } = props

    const alert = useAlert()

    const valueLength = value.length

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
            setOptions([]);
            return;
        }

        try {
            //const response = await axios.get(`${apiUrl}?${apiUrlQuery}&${keySearch}=${inputValue.toLowerCase()}`);
            const response = await axios.get(apiUrl, { params: { key: keySearch, val: escapeRegExp(inputValue), type: type } });
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
            setInputValue("");
        } else if (value.length < limit) {
            newValue = [...value, { ...option }];
            handleChange(newValue);
            setOptions([]);
            setInputValue("");
        }
    }

    function handleDeleteValue(option) {
        let newValue = [...value]
        handleChange(newValue.filter(function (el) { return el._id !== option._id }));
    }

    return (
        <fieldset className={`select-multiple-value ${className || ''}`}>
            <label>{label}</label>

            <ul className="select-multiple-value__selected">
                {
                    Array.isArray(value) && value.map((option, index) => {
                        return (
                            <li key={'search-select_' + index}>
                                {Array.isArray(keysOption) && keysOption.map((key) => {
                                    return (
                                        <span
                                            key={'search-select_selected_' + option._id + '_' + key}
                                            className={`${className}__${key}`}
                                        >
                                            {option[key]}
                                        </span>
                                    )
                                })}

                                {
                                    (valueLength - 1) === index ? (
                                        <button className="select-multiple-value__btn-delete" onClick={(e) => handleDeleteValue(option)}>
                                            <FontAwesome
                                                name="times-circle"
                                            />
                                        </button>
                                    ) : null
                                }
                            </li>
                        )
                    })
                }
            </ul>

            {value.length < limit ? (
                <>
                    <input
                        className="select-multiple-value__input"
                        value={inputValue}
                        onChange={handleSearchInputChange}
                    />
                    <button className="select-multiple-value__search" onClick={handleGetData}>
                        <FontAwesome
                            name="search"
                        />
                    </button>
                </>
            ) : null}

            {value.length < limit && Array.isArray(options) && options.length > 0 ? (
                <ul className="select-multiple-value__suggestions">
                    {Array.isArray(options) && options.map((option, index) => {
                        return (
                            <li onClick={() => handleAddValue(option)} key={index} className={value.filter(e => e._id === option._id).length ? 'active' : ''}>
                                {Array.isArray(keysOption) && keysOption.map((key) => {
                                    return (
                                        <span
                                            key={'search-select_suggestion_' + option._id + '_' + key}
                                            className={`${className}__${key}`}
                                        >
                                            {option[key]}
                                        </span>
                                    )
                                })}
                            </li>
                        )
                    })}
                </ul>) : null
            }

        </fieldset>
    );
};

export default ApiSearchInputMultipleValue;