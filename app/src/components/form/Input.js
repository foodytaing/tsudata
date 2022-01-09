import React, { useEffect, useState } from "react";
import playerList from '../../data/player_list.json'

const players = JSON.parse(JSON.stringify(playerList, function(a, b) {
  return typeof b === "string" ? b.toLowerCase() : b
}));

function tri(a, b) {
    if (a.name < b.name) return -1;
    else if (a.name === b.name) return 0;
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
        fieldClass,
        readonly = false
    } = props

    switch (type) {
        case 'select':
            return <Select {...props} />;
        case 'select_player_name':
            return <SelectAutoSuggestPlayerName {...props} />;
        case 'checkbox':
            return <CheckBoxInput {...props} />;
        default:
            return (
                <>
                    <fieldset className={fieldClass}>
                        {label ? (
                            <label>{label}</label>
                        ) : null}
                        <input
                            placeholder={placeholder}
                            type={type}
                            name={name}
                            onChange={e => handleChange(e)}
                            value={value}
                            className={readonly ? "input--readonly" : ""}
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
        fieldClass
    } = props

    return (
        <fieldset className={fieldClass}>
            {label ? (
                <label>{label}</label>
            ) : null}
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
        label,
        fieldClass
    } = props

    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setInputValue(value);
        setSuggestions([]);
    }, [value]);

    function handleInputValueChange(e) {
        setInputValue(e.target.value);

        if (e.target.value === "") {
            handleChange({
                country: "",
                first_name: "",
                last_name: "",
                team: undefined
            });
        } else {
            getSuggestion(e.target.value);
        }
    }

    function getSuggestion(inputValue) {
        const value = inputValue.trim().toLowerCase();
        const length = inputValue.length;

        if (length <= 1)
            return setSuggestions([]);

        const suggestions = players.filter(function (item) {
            return (
                item.first_name.toLowerCase().slice(0, length) === value ||
                item.last_name.toLowerCase().slice(0, length) === value
            );
        });

        setSuggestions(suggestions);
    }

    function handleSelectPlayer(player) {
        setInputValue(player.first_name)
        handleChange(player);
    }

    return (
        <fieldset className={fieldClass}>
            {label ? (
                <label>{label}</label>
            ) : null}
            <div className="wrapper-input-auto-complete">
                <input type="search" autoComplete="off" onChange={(e) => handleInputValueChange(e)} value={inputValue} />
                {Array.isArray(suggestions) && suggestions.length > 0 ? (
                    <ul className="wrapper-input-auto-complete__suggestions">
                        {Array.isArray(suggestions) && suggestions.map((option, index) => {
                            return (
                                <li
                                    className="wrapper-input-auto-complete__suggestion-item"
                                    key={index}
                                    onClick={() => handleSelectPlayer(
                                        {
                                            first_name: option?.first_name,
                                            last_name: option?.last_name,
                                            country: option?.country,
                                            team: option?.team,
                                        }
                                    )}
                                >
                                    {option?.first_name} {option?.last_name}
                                </li>
                            )
                        })}
                    </ul>
                ) : null}
            </div>
        </fieldset>
    )
}

export const CheckBoxInput = (props) => {
    const {
        value,
        handleChange,
        label,
        options,
        name,
        fieldClass,
        className
    } = props

    function handleRadioChange(e) {
        const newValue = [...value]

        if (newValue.includes(e.target.value)) {
            newValue.splice(newValue.indexOf(e.target.value), 1);
        } else {
            newValue.push(e.target.value)
        }

        const newObj = {}
        newObj[name] = newValue

        handleChange(newObj)
    }

    return (
        <fieldset className={`${fieldClass} ${className}`}>
            <label>{label}</label>
            <div className='checkbox-list'>
                {Array.isArray(options) && options.map((option) => {
                    return (
                        <div key={option.value}>
                            <input type="checkbox" id={option.label} value={option.value} checked={value.includes(option.value)} onChange={e => handleRadioChange(e)} />
                            <label htmlFor={option.label}>{option.label}</label>
                        </div>
                    )
                })}
            </div>
        </fieldset>
    )
}

export default Input;