import React, { useState, useEffect } from "react";
import Input from "../components/form/Input"
import { useAlert } from 'react-alert'
import useSWR, { mutate } from 'swr'
import axios from "axios";
import WidgetCloudinary from "../components/WidgetCloudinary";

import ApiSearchInputMultipleValue from "../components/form/ApiSearchInputMultipleValue";

// Form Data
import collectionList from '../data/collection_list.json'
import rarityList from '../data/rarity_list.json'
import colorList from '../data/color_list.json'
import countryList from '../data/country_list.json'
import seriesList from '../data/series_list.json'
import teamList from '../data/team_list.json'
import floatballList from '../data/floatball_list.json'
import positionList from '../data/position_list.json'  

const playerForm = [
    {
        label: "Klab ID",
        name: "klab_id",
        type: "number"
    },
    {
        label: "Prénom",
        name: "first_name",
        type: "select_player_name"
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
        label: "Titre",
        name: "sub_name"
    },
    {
        label: "Image",
        name: "image_url"
    },
    {
        label: "Rareté",
        name: "rarity",
        type: "select",
        options: rarityList
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
        label: "Equipe",
        name: "team" ,
        type: "select",
        options: teamList
    },
    {
        label: "Série",
        name: "series",
        type: "select",
        options: seriesList
    },
    {
        label: "Position",
        name: "positions",
        type: "checkbox",
        options: positionList
    }
]

const playerStatsForm = [
    {
        label: "Endurance",
        name: "stamina",
        type: "number"
    },
    {
        label: "Dribble",
        name: "dribble",
        type: "number"
    },
    {
        label: "Tir",
        name: "shot",
        type: "number"
    },
    {
        label: "Passe",
        name: "pass",
        type: "number"
    },
    {
        label: "Tacle",
        name: "tackle",
        type: "number"
    },
    {
        label: "Contre",
        name: "block",
        type: "number"
    },
    {
        label: "Interception",
        name: "intercept",
        type: "number"
    },
    {
        label: "Rapidité",
        name: "speed",
        type: "number"
    },
    {
        label: "Puissance",
        name: "power",
        type: "number"
    },
    {
        label: "Technicité",
        name: "technique",
        type: "number"
    },
    {
        label: "Coup de poing",
        name: "punch",
        type: "number"
    },
    {
        label: "Arrêt",
        name: "catch",
        type: "number"
    },
    {
        label: "Ballon haut",
        name: "highBall",
        type: "select",
        options: floatballList
    },
    {
        label: "Ballon bas",
        name: "lowBall",
        type: "select",
        options: floatballList
    }
]

const initialPlayerSelected = {
    "klab_id": "",
    "image_url": "",
    "color": "",
    "rarity": "",
    "collection_card": "",
    "first_name": "",
    "last_name": "",
    "sub_name": "",
    "country": "",
    "team": "",
    "series": "",
    "positions": [],
    "passive_skill": [],
}

const initialPlayerStats = {
    "stamina": "",
    "dribble": "",
    "shot": "",
    "pass": "",
    "tackle": "",
    "block": "",
    "intercept": "",
    "speed": "",
    "power": "",
    "technique": "",
    "highBall": "",
    "lowBall": ""
}

const fetcher = url => fetch(url).then(r => r.json())

const PlayerList = () => {
    const alert = useAlert()

    //state
    const [playerSelected, setPlayerSelected] = useState({});
    const [playerStats, setPlayerStats] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newPlayerForm, setNewPlayerForm] = useState(false);

    const [PassiveSkill, setPassiveSkill] = useState()
    const [fetchPassiveSkill, setFetchPassiveSkill] = useState(false);

    const [LeaderSkill, setLeaderSkill] = useState()
    const [fetchLeaderSkill, setFetchLeaderSkill] = useState(false);

    const [HiddenAbilities, setHiddenAbilities] = useState();
    const [fetchHiddenAbilities, setFetchHiddenAbilities] = useState(false);

    const [Techniques, setTechniques] = useState();
    const [fetchTechniques, setFetchTechniques] = useState(false);

    const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/player/`, fetcher)

    useEffect(() => {     
        if (!fetchLeaderSkill) {
            playerSelected?.leader_skill?.forEach(el => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${el._id}`)
                    .then((res) => {
                        setLeaderSkill([{...res.data}])
                        setFetchLeaderSkill(true)
                    }).catch((err) => console.log(err))      
            })
        }
        if (!fetchPassiveSkill) {
            playerSelected?.passive_skill?.forEach(el => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${el._id}`)
                    .then((res) => {
                        setPassiveSkill([{...res.data}])
                        setFetchPassiveSkill(true)
                    }).catch((err) => console.log(err))      
            })
        };
        if (!fetchHiddenAbilities) {
            let HA = []
            playerSelected?.hidden_abilities?.forEach(el => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${el._id}`)
                    .then((res) => {
                        HA.push(res.data);
                        setHiddenAbilities([...HA]);
                        setFetchHiddenAbilities(true);
                    }).catch((err) => console.log(err))      
            })
        }
        if (!fetchTechniques) {
            let Techniques = []
            playerSelected?.techniques?.forEach(el => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/technique/${el._id}`)
                    .then((res) => {
                        Techniques.push(res.data);
                        setTechniques([...Techniques]);
                        setFetchTechniques(true);
                    }).catch((err) => console.log(err))      
            })
        }
    }, [playerSelected])

    async function handleGetPlayer(id) {
        setFetchPassiveSkill(false);
        setPassiveSkill();
        setFetchLeaderSkill(false);
        setLeaderSkill();
        setFetchHiddenAbilities(false);
        setHiddenAbilities()
        setFetchTechniques(false);
        setTechniques();

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/player/${id}`);
            const formatPassiveSkill = response.data.passive_skill.map(skill => { return {"_id": skill}});
            const formatLeaderSkill = response.data.leader_skill.map(skill => { return {"_id": skill}});
            const formatHiddenAbilitiesSkill = response.data.hidden_abilities.map(skill => { return {"_id": skill}});
            const formatTechniques = response.data.techniques.map(technique => { return {"_id": technique}});
            setPlayerSelected(({
                ...initialPlayerSelected,
                ...response.data,
                passive_skill: formatPassiveSkill,
                leader_skill: formatLeaderSkill,
                hidden_abilities: formatHiddenAbilitiesSkill,
                techniques: formatTechniques
            }));
            setPlayerStats(({...initialPlayerStats, ...response.data.stats}));
            setShowForm(true);
            return response.data;
        } catch(err) {
            alert.show('Une erreur est survenue');
            return err
        } 
    }

    async function handleDelete(id) {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/player/${id}`);
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`, data.filter(function(el) { return el._id !== id; }), false)
            alert.show('La suppression du joueur a bien été pris en compte');
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleUpdate() {
        const newPassiveSkill = PassiveSkill.map(skill => skill._id);
        const newLeaderSkill = LeaderSkill.map(skill => skill._id);
        const newHiddenAbilitiesSkill = HiddenAbilities.map(skill => skill._id);
        const newTechniques = Techniques.map(skill => skill._id);

        const newPlayerData = {
            ...playerSelected,
            stats: { ...playerStats },
            passive_skill: newPassiveSkill,
            leader_skill: newLeaderSkill,
            hidden_abilities: newHiddenAbilitiesSkill,
            techniques: newTechniques
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/player/${newPlayerData._id}`, newPlayerData);
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`, data.map(obj => [newPlayerData].find(o => o._id === obj._id) || obj), false)
            alert.show('Les modifications du joueur ont bien été prises en compte');
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleCreate() {
        const newPlayerData = {
            ...playerSelected,
            stats: { ...playerStats }
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/player/`, newPlayerData);
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`, [newPlayerData, ...data], false)
            alert.show('La création de joueur a bien été prises en compte');
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    function handleInputInfoChange(e) {
        const target = e?.target;
        const value = target?.type === 'checkbox' ? target?.checked : target?.value;
        const name = target?.name;
        let newPlayerSelected = {}

        if (target) {
            newPlayerSelected = {
                ...playerSelected,
                [name]: value
            }
        } else {
            newPlayerSelected = {
                ...playerSelected,
                ...e
            }
        }

        setPlayerSelected(newPlayerSelected);
    }

    function handleInputStatsChange(e) {
        const target = e?.target;
        const value = target?.type === 'checkbox' ? target?.checked : target?.value;
        const name = target?.name;

        const newPlayerStats = {
            ...playerStats,
            [name]: value
        }

        setPlayerStats(newPlayerStats);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (newPlayerForm) {
            handleCreate();
        } else {
            handleUpdate();
        }
    }

    function showNewPlayerForm() {
        setFetchPassiveSkill(false);
        setPassiveSkill();
        setFetchLeaderSkill(false);
        setLeaderSkill();
        setFetchHiddenAbilities(false);
        setHiddenAbilities()
        setFetchTechniques(false);
        setTechniques();

        setNewPlayerForm(true);
        setShowForm(true);
        setPlayerSelected({
            ...initialPlayerSelected
        });
        setPlayerStats({
            ...initialPlayerStats
        });
    }

    function onImageUploaded(e) {
        const newPlayerSelected = {
            ...playerSelected,
            image_url: e.info.url
        }

        setPlayerSelected(newPlayerSelected);
    }

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return (
        <>
            <h1>Backoffice Liste des joueurs</h1>
            <button onClick={showNewPlayerForm}>Nouveau joueur</button>
            <ul>
                {Array.isArray(data) && data.reverse().map((player, index) => {
                    return (
                        <li key={index}>
                            <img
                                src={player?.image_url ? player?.image_url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                                alt={player?.first_name}
                                width="20"
                            />
                            {player?.first_name} {player?.last_name}
                            <button onClick={() => handleGetPlayer(player?._id)}>Modifier</button>
                            <button onClick={() => handleDelete(player?._id)}>Supprimer</button>
                        </li>
                    )
                })}
            </ul>

            {
                showForm ? (
                    <>
                        <div className="modal">
                            <h2>{playerSelected?._id || 'Nouveau joueur'}</h2>
                            <WidgetCloudinary
                                onSuccess={onImageUploaded}
                            />
                            <form autoComplete="off" onSubmit={handleSubmit}>
                                <img
                                    src={playerSelected?.image_url ? playerSelected?.image_url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                                    alt={playerSelected?.firt_name}
                                    width="100"
                                />
                                {
                                    playerForm.map((form, index) => {
                                        return (
                                            <Input
                                                key={index}
                                                label={form?.label}
                                                name={form?.name}
                                                type={form?.type}
                                                value={playerSelected[form?.name] || ""}
                                                handleChange={handleInputInfoChange}
                                                readonly={form?.readonly}
                                                options={form?.options}
                                            />
                                        )
                                    })
                                }
                                {
                                    playerStatsForm.map((form, index) => {
                                        return (
                                            <Input
                                                key={index}
                                                label={form?.label}
                                                name={form?.name}
                                                type={form?.type}
                                                value={playerStats[form?.name]}
                                                handleChange={handleInputStatsChange}
                                                readonly={form?.readonly}
                                                options={form?.options}
                                            />
                                        )
                                    })
                                }

                                <ApiSearchInputMultipleValue
                                    apiUrl={`${process.env.REACT_APP_API_URL}/api/skill/search`}
                                    label="Compétence d'équipe"
                                    handleChange={setLeaderSkill}
                                    type="leader_skill"
                                    value={LeaderSkill}
                                    limit={1}
                                    resetOnDataChange={playerSelected}
                                />

                                <ApiSearchInputMultipleValue
                                    apiUrl={`${process.env.REACT_APP_API_URL}/api/skill/search`}
                                    label="Compétence passive"
                                    handleChange={setPassiveSkill}
                                    type="passive_skill"
                                    value={PassiveSkill}
                                    limit={1}
                                    resetOnDataChange={playerSelected}
                                />

                                <ApiSearchInputMultipleValue
                                    apiUrl={`${process.env.REACT_APP_API_URL}/api/skill/search`}
                                    label="Potentiel"
                                    handleChange={setHiddenAbilities}
                                    type="hidden_ability"
                                    value={HiddenAbilities}
                                    limit={5}
                                    resetOnDataChange={playerSelected}
                                />

                                <ApiSearchInputMultipleValue
                                    apiUrl={`${process.env.REACT_APP_API_URL}/api/technique/search`}
                                    label="Techniques"
                                    handleChange={setTechniques}
                                    value={Techniques}
                                    limit={7}
                                    resetOnDataChange={playerSelected}
                                />

                                {
                                    newPlayerForm ? (
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

export default PlayerList;