import React, { useState } from "react";
import Input from "../components/form/Input"
import { useAlert } from 'react-alert'

import useSWR, { mutate } from 'swr'
import axios from "axios";

const dataForm = [
    {
        label: "Nom",
        name: "name"
    },
    {
        label: "Rang",
        name: "rank",
        type: "select",
        options: [
            {
                label: "S",
                value: "S"
            },
            {
                label: "A",
                value: "A"
            },
            {
                label: "A (EX)",
                value: "A (EX)"
            },
            {
                label: "B",
                value: "B"
            },
            {
                label: "C",
                value: "C"
            }
        ]
    },
    {
        label: "Type de technique",
        name: "type_technique",
        type: "select",
        options: [
            {
                "label": "Dribble",
                "value": "dribble"
            },
            {
                "label": "Tir",
                "value": "shot"
            },
            {
                "label": "Passe",
                "value": "pass"
            },
            {
                "label": "Tacle",
                "value": "tackle"
            },
            {
                "label": "Contre",
                "value": "block"
            },
            {
                "label": "Interception",
                "value": "intercept"
            },
            {
                "label": "Rapidité",
                "value": "speed"
            },
            {
                "label": "Puissance",
                "value": "power"
            },
            {
                "label": "Technique",
                "value": "technique"
            },
            {
                "label": "Coup de poing",
                "value": "punch"
            },
            {
                "label": "Capte",
                "value": "catch"
            }
        ]
    },
    {
        label: "Endurance",
        name: "stamina",
        type: "number"
    },
    {
        label: "Intensité",
        name: "intensity",
        type: "number"
    },
    {
        label: "Combinaison",
        name: "combination",
        type: "number"
    },
    {
        label: "Nombre de joueur envoyé dans les airs",
        name: "blow_off",
        type: "number"
    },
    {
        label: "Distance",
        name: "distance_decay",
        type: "select",
        options: [
            {
                label: "Oui",
                value: "true",
            },
            {
                label: "Non",
                value: "false",
            }
        ]
    },
    {
        label: "Angle",
        name: "angle_decay",
        type: "select",
        options: [
            {
                label: "Oui",
                value: "true",
            },
            {
                label: "Non",
                value: "false",
            }
        ]
    }
]

const initialDataSelected = {
    "name": "",
    "rank": "",
    "type_technique": "",
    "stamina": "",
    "intensity": "",
    "combination": "0",
    "blow_off": "0",
    "distance_decay": "false",
    "angle_decay": "false"
}

const fetcher = url => fetch(url).then(r => r.json())
const apiUrl = `${process.env.REACT_APP_API_URL}/api/technique/`

const TechniqueList = () => {
    const alert = useAlert()

    //state
    const [dataSelected, setDataSelected] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newDataForm, setNewDataForm] = useState(false);

    const { data, error } = useSWR(apiUrl, fetcher)

    async function handleGetData(id) {
        try {
            const response = await axios.get(apiUrl+id);
            setDataSelected({...initialDataSelected, ...response.data});
            setShowForm(true);
            return response.data;
        } catch(err) {
            alert.show('Une erreur est survenue');
            return err
        }
    }

    async function handleDelete(id) {
        try {
            const response = await axios.delete(apiUrl+id);
            mutate(apiUrl, data.filter(function(el) { return el._id !== id; }), false)
            alert.show('La suppression de la compétence a bien été pris en compte');
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleUpdate() {
        const newData = {
            ...dataSelected
        }

        try {
            const response = await axios.put(apiUrl+newData._id, newData);
            mutate(apiUrl, data.map(obj => [newData].find(o => o._id === obj._id) || obj), false)
            alert.show('Les modifications de la compétence ont bien été prises en compte');
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleCreate() {
        const newData = {
            ...dataSelected
        }

        try {
            const response = await axios.post(apiUrl, newData);
            mutate(apiUrl, [...data, newData], false)
            alert.show('La création de la compétence a bien été prises en compte');
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (newDataForm) {
            handleCreate();
        } else {
            handleUpdate();
        }
    }

    function handleInputInfoChange(e) {
        const target = e?.target;
        const value = target?.type === 'checkbox' ? target?.checked : target?.value;
        const name = target?.name;
        let newDataSelected = {}

        if (target) {
            newDataSelected = {
                ...dataSelected,
                [name]: value
            }
        } else {
            newDataSelected = {
                ...dataSelected,
                ...e
            }
        }

        setDataSelected(newDataSelected);
    }

    function showNewDataForm() {
        setNewDataForm(true);
        setShowForm(true);
        setDataSelected({
            ...initialDataSelected
        });
    }

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return (
        <>
            <h1>Backoffice Liste des techniques</h1>
            <button onClick={showNewDataForm}>Nouvelle technique</button>
            <ul>
                {Array.isArray(data) && data.reverse().map((item, index) => {
                    return (
                        <li key={index}>
                            {item?.rank} {item?.name}
                            <p>{item?.description}</p>
                            <button onClick={() => handleGetData(item?._id)}>Modifier</button>
                            <button onClick={() => handleDelete(item?._id)}>Supprimer</button>
                        </li>
                    )
                })}
            </ul>

            {
                showForm ? (
                    <>
                        <div className="modal">
                            <form autoComplete="off" onSubmit={handleSubmit}>
                                <h2>{dataSelected?._id || 'Nouvelle compétence'}</h2>
                                {
                                    dataForm.map((form, index) => {
                                        return (
                                            <Input
                                                key={index}
                                                label={form?.label}
                                                name={form?.name}
                                                type={form?.type}
                                                value={dataSelected[form?.name] || ""}
                                                handleChange={handleInputInfoChange}
                                                readonly={form?.readonly}
                                                options={form?.options}
                                            />
                                        )
                                    })
                                }
                                {
                                    newDataForm ? (
                                        <button type="submit">Créer</button>
                                    ) : (
                                        <button type="submit">Mettre à jour</button>
                                    )
                                }
                            </form>
                        </div>
                    </>
                ) : null
            }
        </>
    );
};

export default TechniqueList;