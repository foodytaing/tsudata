import React, { useEffect, useState } from "react";

const players = [
    {
        first_name: 'Tsubasa',
        last_name: 'Ozora'
    },
    {
        first_name: 'Carlos',
        last_name: 'Santana'
    },
    {
        first_name: 'Natureza',
        last_name: ''
    },
    {
        first_name: 'Rivaul',
        last_name: ''
    }
]

function tri(a, b) {
    if (a.text < b.text) return -1;
    else if (a.text == b.text) return 0;
    else return 1;
}

players.sort(tri);

export const Input = (props) => {
    const {
        value,
        handleChange,
        placeholder,
        label,
        type,
        name,
        options,
        readonly = false
    } = props

    switch (type) {
        case 'select':
            return <Select { ...props } />;
        case 'select_player_name':
            return <SelectAutoSuggestPlayerName { ...props } />;
        default:
            return (
                <>
                    <fieldset>
                        <label>{label}</label>
                        <input
                            placeholder={placeholder}
                            type={type}
                            name={name}
                            onChange={e => handleChange(e)}
                            readOnly={readonly}
                            value={value}
                        />
                    </fieldset>
                </>
            );
    }
}

export const Select = (props) => {
    const {
        value,
        handleChange,
        placeholder,
        label,
        name,
        options,
    } = props

    return (
        <fieldset>
            <label>{label}</label>
            <select
                placeholder={placeholder}
                name={name}
                onChange={e => handleChange(e)}
                value={value}
            >
                <option></option>
                {Array.isArray(options) && options.map((option, index) => {
                    return (
                        <option key={index} value={option?.value}>{option?.label}</option>
                    )
                })}
            </select>
        </fieldset>
    )
}

export const SelectAutoSuggestPlayerName = (props) => {
    const {
        value,
        handleChange,
        label
    } = props

    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);

    function handleInputValueChange(e) {
        setInputValue(e.target.value);
        getSuggestion(e.target.value)
    }

    function getSuggestion(inputValue) {
        const value = inputValue.trim().toLowerCase();
        const length = inputValue.length;

        const suggestions = length === 0 ? [] : players.filter(player =>
            player.first_name.toLowerCase().slice(0, length) === value
        );

        setSuggestions(suggestions);
    }

    function handleSelectPlayer(player) {
        setInputValue(player.first_name)
        handleChange(player);
    }

    return (
        <fieldset>
            <label>{label}</label>

            <input onChange={(e) => handleInputValueChange(e)} value={inputValue} />
            <ul>
                {Array.isArray(suggestions) && suggestions.map((option, index) => {
                    return (
                        <li
                            key={index}
                            onClick={() => handleSelectPlayer({first_name: option?.first_name, last_name: option?.last_name})}
                        >
                            {option?.first_name} {option?.last_name}
                        </li>
                    )
                })}
            </ul>
        </fieldset>
    )
}

export default Input;