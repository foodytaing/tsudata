import React, { useState } from "react";
import Input from "../components/form/Input"
import { useAlert } from 'react-alert'
import FontAwesome from 'react-fontawesome'
import useSWR, { mutate } from 'swr'
import axios from "axios";
import { Modal, ValidModal } from '../components/Modal'

const dataForm = [
    {
        label: "Nom",
        name: "name",
        fieldClass: "full-width"
    },
    {
        label: "Rang",
        name: "rank",
        type: "select",
        options: [
            {
                label: "S",
                value: "s"
            },
            {
                label: "A",
                value: "a"
            },
            {
                label: "B",
                value: "b"
            },
            {
                label: "C",
                value: "c"
            }
        ],
        fieldClass: "quarter-width"
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
                "label": "Une-Deux",
                "value": "one-two"
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
                "label": "Arrêt",
                "value": "catch"
            },
            {
                "label": "Ballon Haut (tête)",
                "value": "highball"
            },
            {
                "label": "Ballon Bas (volée)",
                "value": "lowball"
            }
        ],
        fieldClass: "quarter-width"
    },
    {
        label: "Endurance",
        name: "stamina",
        type: "number",
        fieldClass: "quarter-width"

    },
    {
        label: "Intensité",
        name: "intensity",
        type: "number",
        fieldClass: "quarter-width"
    },
    {
        label: "Combinaison",
        name: "combination",
        type: "number",
        fieldClass: "quarter-width"
    },
    {
        label: "Envoyé dans les airs",
        name: "blow_off",
        type: "number",
        fieldClass: "quarter-width"
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
        ],
        fieldClass: "quarter-width"
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
        ],
        fieldClass: "quarter-width"
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
            const response = await axios.get(apiUrl + id);
            setDataSelected({ ...initialDataSelected, ...response.data });
            setShowForm(true);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err
        }
    }

    async function handleDelete(id) {
        try {
            const response = await axios.delete(apiUrl + id);
            mutate(apiUrl, data.filter(function (el) { return el._id !== id; }), false)
            alert.show('La suppression de la compétence a bien été pris en compte');
            mutate(apiUrl);
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
            const response = await axios.put(apiUrl + newData._id, newData);
            mutate(apiUrl, data.map(obj => [newData].find(o => o._id === obj._id) || obj), false)
            alert.show('Les modifications de la compétence ont bien été prises en compte');
            mutate(apiUrl);
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
            mutate(apiUrl);
            setShowForm(false);
            setNewDataForm(false);
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
        <div className="container">
            <h1>Backoffice Liste des techniques</h1>
            <button className="button--primary button-data--create" onClick={showNewDataForm}>Nouvelle technique</button>
            <table className="table-data-list">
                <tbody>
                    {Array.isArray(data) && data.reverse().map((item, index) => {
                        return (
                            <tr className="table-data-list__item technique-data-inline" key={index}>
                                <td>
                                    {item?.rank}
                                </td>
                                <td>
                                    {item?.type_technique}
                                </td>
                                <td>
                                    {item?.name}
                                </td>
                                <td>
                                    <FontAwesome
                                        name="bolt"
                                    />
                                    {item?.intensity}
                                </td>
                                <td>
                                    <FontAwesome
                                        name="fire"
                                    />
                                    {item?.stamina}
                                </td>
                                <td>
                                    <div className="table-data-list__action">
                                        <ValidModal
                                            label="Supprimer"
                                            onConfirm={() => handleDelete(item?._id)}
                                            question={"Confirmer la suppression de la technique."}
                                        />
                                        <button className="button--secondary" onClick={() => handleGetData(item?._id)}>Modifier</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Modal displayModal={showForm} handleClose={() => setShowForm(false)}>
                <form className="simple-form" autoComplete="off" onSubmit={handleSubmit}>
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
                                    fieldClass={form?.fieldClass}
                                />
                            )
                        })
                    }
                    <fieldset>
                        {
                            newDataForm ? (
                                <button className="button--primary btn-bg--green" type="submit">Créer</button>
                            ) : (
                                <button className="button--primary btn-bg--green" type="submit">Mettre à jour</button>
                            )
                        }
                    </fieldset>
                </form>
            </Modal>
        </div >
    );
};

export default TechniqueList;