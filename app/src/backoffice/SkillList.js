import React, { useState } from "react";
import Input from "../components/form/Input"
import { useAlert } from 'react-alert'

import useSWR, { mutate } from 'swr'
import axios from "axios";

const skillForm = [
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
        label: "Description",
        name: "description"
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
        ]
    },
    {
        label: "Effet (en %)",
        name: "effect_value",
        type: "number"
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
        ]
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
            }
        ]
    }
]

const initialSkillSelected = {
    "name": "",
    "rank": "",
    "description": "",
    "type_skill": "",
    "effect_value": "",
    "effect_type": "",
    "assignment_stats": ["catch", "dribble", "shot", "pass", "tackle", "block", "intercept", "speed", "power", "technique", "punch", "catch"],
}

const fetcher = url => fetch(url).then(r => r.json())

const SkillList = () => {
    const alert = useAlert()

    //state
    const [skillSelected, setSkillSelected] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newSkillForm, setNewSkillForm] = useState(false);

    const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/skill/`, fetcher)

    async function handleGetSkill(id) {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill/${id}`);
            setSkillSelected({...initialSkillSelected, ...response.data});
            setShowForm(true);
            return response.data;
        } catch(err) {
            alert.show('Une erreur est survenue');
            return err
        }
    }

    async function handleDelete(id) {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/skill/${id}`);
            mutate(`${process.env.REACT_APP_API_URL}/api/skill/`, data.filter(function(el) { return el._id !== id; }), false)
            alert.show('La suppression de la compétence a bien été pris en compte');
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleUpdate() {
        const newSkillData = {
            ...skillSelected
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/skill/${newSkillData._id}`, newSkillData);
            mutate(`${process.env.REACT_APP_API_URL}/api/skill/`, data.map(obj => [newSkillData].find(o => o._id === obj._id) || obj), false)
            alert.show('Les modifications de la compétence ont bien été prises en compte');
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleCreate() {
        const newSkillData = {
            ...skillSelected
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/skill/`, newSkillData);
            mutate(`${process.env.REACT_APP_API_URL}/api/skill/`, [...data, newSkillData], false)
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

        if (newSkillForm) {
            handleCreate();
        } else {
            handleUpdate();
        }
    }

    function handleInputInfoChange(e) {
        const target = e?.target;
        const value = target?.type === 'checkbox' ? target?.checked : target?.value;
        const name = target?.name;
        let newSkillSelected = {}

        if (target) {
            newSkillSelected = {
                ...skillSelected,
                [name]: value
            }
        } else {
            newSkillSelected = {
                ...skillSelected,
                ...e
            }
        }

        setSkillSelected(newSkillSelected);
    }

    function showNewSkillForm() {
        setNewSkillForm(true);
        setShowForm(true);
        setSkillSelected({
            ...initialSkillSelected
        });
    }

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return (
        <>
            <h1>Backoffice Liste des compétences</h1>
            <button onClick={showNewSkillForm}>Nouvelle compétence</button>
            <ul>
                {Array.isArray(data) && data.reverse().map((skill, index) => {
                    return (
                        <li key={index}>
                            {skill?.rank} {skill?.name}
                            <p>{skill?.description}</p>
                            <button onClick={() => handleGetSkill(skill?._id)}>Modifier</button>
                            <button onClick={() => handleDelete(skill?._id)}>Supprimer</button>
                        </li>
                    )
                })}
            </ul>

            {
                showForm ? (
                    <>
                        <div className="modal">
                            <form autoComplete="off" onSubmit={handleSubmit}>
                                <h2>{skillSelected?._id || 'Nouvelle compétence'}</h2>
                                {
                                    skillForm.map((form, index) => {
                                        return (
                                            <Input
                                                key={index}
                                                label={form?.label}
                                                name={form?.name}
                                                type={form?.type}
                                                value={skillSelected[form?.name]}
                                                handleChange={handleInputInfoChange}
                                                readonly={form?.readonly}
                                                options={form?.options}
                                            />
                                        )
                                    })
                                }
                                {
                                    newSkillForm ? (
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

export default SkillList;