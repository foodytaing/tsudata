import React, { useState, useEffect, useRef } from "react";
import FontAwesome from 'react-fontawesome'
import Input from "../components/form/Input"

import colorList from '../data/color_list.json'
import countryList from '../data/country_list.json'
import seriesList from '../data/series_list.json'
import collectionList from '../data/collection_list.json'
import dateList from '../data/date_list.json'

import "./filterPlayer.scss";

const filterForm = [
    {
        label: "Prénom",
        name: "first_name",
        type: "select_player_name",
    },
    {
        label: "Nom",
        name: "last_name",
        readonly: true
    },
    {
        label: "Couleur",
        name: "color",
        type: "select",
        options: colorList
    },
    {
        label: "Collection",
        name: "collection_card",
        type: "select",
        options: collectionList
    },
    {
        label: "Pays",
        name: "country",
        type: "select",
        options: countryList
    },
    {
        label: "Série",
        name: "series",
        type: "select",
        options: seriesList
    },
    {
        label: "Gratuit",
        name: "chest",
        type: "select",
        options: [
            {
                "label": "Oui",
                "value": "true"
            },
            {
                "label": "Non",
                "value": "false"
            },
        ]
    }
]

const dateFilterForm = [
    {
        label: "Date",
        name: "createdAt",
        type: "select",
        options: dateList
    }
]

const positionFilterForm = [
    {
        label: "Position",
        name: "position",
        type: "select",
        options: [
            {
                "label": "AT",
                "value": "at"
            },
            {
                "label": "MO",
                "value": "mo"
            },
            {
                "label": "MD",
                "value": "md"
            },
            {
                "label": "DF",
                "value": "df"
            },
            {
                "label": "GB",
                "value": "gb"
            }
        ]
    }
]

export const FilterPlayer = (props) => {
    const {
        handleFilterChange,
        handleDateFilterChange,
        handlePositionFilterChange,
        filter,
        dateFilter,
        positionFilter,
    } = props

    function handleChange(e) {
        const target = e?.target;
        const value = target?.type === 'checkbox' ? target?.checked : target?.value;
        const name = target?.name;
        let newFilter = {}

        if (target) {
            newFilter = {
                ...filter,
                [name]: value
            }
        } else {
            delete e.country;

            newFilter = {
                ...filter,
                ...e
            }
        }

        Object.keys(newFilter).forEach(key => {
            if (newFilter[key] === undefined || newFilter[key] === "") {
                delete newFilter[key];
            }
        });

        handleFilterChange(newFilter);
    }

    function handleChangeDate(e) {
        const target = e?.target;
        const value = target?.value;
        handleDateFilterChange(value);
    }

    function handleChangePosition(e) {
        const target = e?.target;
        const value = target?.value;
        handlePositionFilterChange(value);
    }

    return (
        <div>
            <form autoComplete="off" className="filter-player">
                {
                    filterForm.map((form, index) => {
                        return (
                            <Input
                                key={index}
                                label={form?.label}
                                name={form?.name}
                                type={form?.type}
                                options={form?.options}
                                fieldClass={form?.fieldClass}
                                handleChange={handleChange}
                                value={filter[form?.name] || ""}
                                readonly={form?.readonly}
                            />
                        )
                    })
                }
                {
                    dateFilterForm.map((form, index) => {
                        return (
                            <Input
                                key={index}
                                label={form?.label}
                                name={form?.name}
                                type={form?.type}
                                options={form?.options}
                                fieldClass={form?.fieldClass}
                                handleChange={handleChangeDate}
                                value={dateFilter || ""}
                                readonly={form?.readonly}
                            />
                        )
                    })
                }
                {
                    positionFilterForm.map((form, index) => {
                        return (
                            <Input
                                key={index}
                                label={form?.label}
                                name={form?.name}
                                type={form?.type}
                                options={form?.options}
                                fieldClass={form?.fieldClass}
                                handleChange={handleChangePosition}
                                value={positionFilter || ""}
                                readonly={form?.readonly}
                            />
                        )
                    })
                }
            </form>
        </div>
    )
}

export default FilterPlayer;