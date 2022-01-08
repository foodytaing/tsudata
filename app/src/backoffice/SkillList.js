import React, { useState } from "react";
import Input from "../components/form/Input"
import { useAlert } from 'react-alert'
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
        label: "Description",
        name: "description",
        fieldClass: "full-width"
    },
    {
        label: "Type de compétence",
        name: "type_skill",
        type: "select",
        options: [
            {
                label: "Compétence d'équipe",
                value: "leader_skill"
            },
            {
                label: "Compétence passive",
                value: "passive_skill"
            },
            {
                label: "Compétence cachée",
                value: "hidden_ability"
            }
        ],
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
        fieldClass: "tier-width"
    },
    {
        label: "Effet (en %)",
        name: "effect_value",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Type d'effet",
        name: "effect_type",
        type: "select",
        options: [
            {
                label: "Paramètres",
                value: "params"
            },
            {
                label: "Intensité",
                value: "intensity"
            },
        ],
        fieldClass: "tier-width"
    },
    {
        label: "Paramètres affectés",
        name: "assignment_stats",
        type: "checkbox",
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
        className: "checkbox-list-wrapper-vertical",
        fieldClass: "full-width"
    }
]

const initialDataSelected = {
    "name": "",
    "rank": "",
    "description": "",
    "type_skill": "",
    "effect_value": "",
    "effect_type": "",
    "assignment_stats": ["dribble", "shot", "pass", "tackle", "block", "intercept", "speed", "power", "technique", "punch", "catch", "highball", "lowball"],
}

const fetcher = url => fetch(url).then(r => r.json())
const apiUrl = `${process.env.REACT_APP_API_URL}/api/skill/`

const SkillList = () => {
    const alert = useAlert()

    //state
    const [dataSelected, setDataSelected] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newDataForm, setNewDataForm] = useState(false);

    const { data, error } = useSWR(apiUrl + "?type_skill=passive_skill", fetcher)
    //const { data, setData } = useState([])

    async function handleGetData(id) {
        try {
            const response = await axios.get(apiUrl + id);

            if (
                (response.data.effect_type === "params" || response.data.effect_type === "intensity") &&
                (!Array.isArray(response.data.assignment_stats) || (Array.isArray(response.data.assignment_stats) && response.data.assignment_stats.length === 0))
            ) {
                const assignment_stats = ["dribble", "shot", "pass", "tackle", "block", "intercept", "speed", "power", "technique", "punch", "catch", "highball", "lowball"]
                try {
                    await axios.put(apiUrl + response.data._id, { assignment_stats });
                } catch (err) {
                    alert.show('Une erreur est survenue');
                }
                setDataSelected({ ...initialDataSelected, ...response.data, assignment_stats });
            } else {
                setDataSelected({ ...initialDataSelected, ...response.data });
            }

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
        let assignment_stats = []

        if (dataSelected.effect_type !== "") {
            assignment_stats = dataSelected.assignment_stats
        }

        const newData = {
            ...dataSelected,
            assignment_stats
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
            <h1>Backoffice Liste des compétences</h1>
            <button className="button--primary button-data--create" onClick={showNewDataForm}>Nouvelle compétence</button>
            <table className="table-data-list">
                <tbody>
                    {Array.isArray(data) && data.reverse().map((item, index) => {
                        return (
                            <tr className="table-data-list__item skill-data-inline" key={index}>
                                <td>
                                    {item?.type_skill}
                                </td>
                                <td>
                                    <div>
                                        <span className="skill-data-inline__name">{item?.rank ? item?.rank + ' ' : null} {item?.name}</span>
                                        <span className="skill-data-inline__description">{item?.description}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-data-list__action">
                                        <ValidModal
                                            label="Supprimer"
                                            onConfirm={() => handleDelete(item?._id)}
                                            question={"Confirmer la suppression de la compétence."}
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
                                    className={form?.className}
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
        </div>
    );
};

export default SkillList;