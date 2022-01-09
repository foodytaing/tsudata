import React, { useState, useEffect } from "react";
import Input from "../components/form/Input"
import { positions, useAlert } from 'react-alert'
import useSWR, { mutate } from 'swr'
import axios from "axios";
import WidgetCloudinary from "../components/WidgetCloudinary";

import { Modal, ValidModal } from '../components/Modal'

import ApiSearchInputMultipleValue from "../components/form/ApiSearchInputMultipleValue";

// Form Data
import collectionList from '../data/collection_list.json'
import rarityList from '../data/rarity_list.json'
import colorList from '../data/color_list.json'
import countryList from '../data/country_list.json'
import seriesList from '../data/series_list.json'
import floatballList from '../data/floatball_list.json'
import positionList from '../data/position_list.json'

const playerForm = [
    {
        label: "Prénom",
        name: "first_name",
        type: "select_player_name",
        fieldClass: "tier-width"
    },
    {
        label: "Nom",
        name: "last_name",
        readonly: true,
        fieldClass: "tier-width"
    },
    {
        label: "Rareté",
        name: "rarity",
        type: "select",
        options: rarityList,
        fieldClass: "tier-width"
    },
    {
        label: "Titre",
        name: "sub_name",
        fieldClass: "full-width"
    },
    {
        label: "Couleur",
        name: "color",
        type: "select",
        options: colorList,
        fieldClass: "tier-width"
    },
    {
        label: "Collection",
        name: "collection_card",
        type: "select",
        options: collectionList,
        fieldClass: "tier-width"
    },
    {
        label: "Position collection",
        name: "position_in_collection",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Pays",
        name: "country",
        type: "select",
        options: countryList,
        fieldClass: "tier-width"
    },
    {
        label: "Série",
        name: "series",
        type: "select",
        options: seriesList,
        fieldClass: "tier-width"
    },
    {
        label: "Coffre",
        name: "chest",
        type: "select",
        options: [
            {
                label: "Non",
                value: "false",
            },
            {
                label: "Oui",
                value: "true",
            }
        ],
        fieldClass: "tier-width"
    },
    {
        label: "Position",
        name: "positions",
        type: "checkbox",
        options: positionList,
        fieldClass: "full-width"
    }
]

const playerStatsForm = [
    {
        label: "Endurance",
        name: "stamina",
        type: "number",
        fieldClass: "full-width"
    },
    {
        label: "Dribble",
        name: "dribble",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Tir",
        name: "shot",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Passe",
        name: "pass",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Tacle",
        name: "tackle",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Contre",
        name: "block",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Interception",
        name: "intercept",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Rapidité",
        name: "speed",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Puissance",
        name: "power",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Technicité",
        name: "technique",
        type: "number",
        fieldClass: "tier-width"
    },
    {
        label: "Coup de poing",
        name: "punch",
        type: "number",
        fieldClass: "half-width"
    },
    {
        label: "Arrêt",
        name: "catch",
        type: "number",
        fieldClass: "half-width"
    },
    {
        label: "Ballon haut",
        name: "highBall",
        type: "select",
        options: floatballList,
        fieldClass: "half-width"
    },
    {
        label: "Ballon bas",
        name: "lowBall",
        type: "select",
        options: floatballList,
        fieldClass: "half-width"
    }
]

const initialPlayerSelected = {
    "image_url": "",
    "color": "",
    "rarity": "ur",
    "collection_card": "",
    "position_in_collection": "",
    "first_name": "",
    "last_name": "",
    "sub_name": "",
    "country": "",
    "series": "",
    "positions": [],
    "passive_skill": [],
    "leader_skill": [],
    "hidden_abilities": [],
    "techniques": [],
    "chest": "false"
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
    "highBall": "1",
    "lowBall": "1"
}

const orderPosition = ['at', 'mo', 'md', 'df', 'gb'];
const fetcher = url => fetch(url).then(r => r.json())

const PlayerList = () => {
    const alert = useAlert()

    //state
    const [playerSelected, setPlayerSelected] = useState({});
    const [playerStats, setPlayerStats] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newPlayerForm, setNewPlayerForm] = useState(false);

    const [PassiveSkill, setPassiveSkill] = useState()
    const [LeaderSkill, setLeaderSkill] = useState()
    const [HiddenAbilities, setHiddenAbilities] = useState();
    const [Techniques, setTechniques] = useState();

    const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/player/`, fetcher)

    async function handleGetPlayer(id) {
        setPassiveSkill([]);
        setLeaderSkill([]);
        setHiddenAbilities([])
        setTechniques([]);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/player/${id}`);
            const formatPassiveSkill = response.data.passive_skill.map(skill => { return { "_id": skill } });
            const formatLeaderSkill = response.data.leader_skill.map(skill => { return { "_id": skill } });
            const formatHiddenAbilitiesSkill = response.data.hidden_abilities.map(skill => { return { "_id": skill } });
            const formatTechniques = response.data.techniques.map(technique => { return { "_id": technique } });

            response.data.hidden_abilities_details = {};
            response.data.passive_skill_details = {};
            response.data.leader_skill_details = {};
            response.data.techniques_details = {};

            response.data?.techniques?.forEach(id => { return response.data.techniques_details[id] = {} })
            response.data?.leader_skill?.forEach(id => { return response.data.leader_skill_details[id] = {} })
            response.data?.passive_skill?.forEach(id => { return response.data.passive_skill_details[id] = {} })
            response.data?.hidden_abilities?.forEach(id => { return response.data.hidden_abilities_details[id] = {} })

            response.data?.leader_skill?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${id}`)
                    .then((res) => {
                        response.data.leader_skill_details[id] = { ...res.data }
                        setLeaderSkill(Object.entries(response.data.leader_skill_details).map(item => item[1]))
                    }).catch((err) => console.log(err))
            })

            response.data?.passive_skill?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${id}`)
                    .then((res) => {
                        response.data.passive_skill_details[id] = { ...res.data }
                        setPassiveSkill(Object.entries(response.data.passive_skill_details).map(item => item[1]))
                    }).catch((err) => console.log(err))
            })

            response.data?.hidden_abilities?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${id}`)
                    .then((res) => {
                        response.data.hidden_abilities_details[id] = { ...res.data }
                        setHiddenAbilities(Object.entries(response.data.hidden_abilities_details).map(item => item[1]));
                    }).catch((err) => console.log(err))
            })

            response.data?.techniques?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/technique/${id}`)
                    .then((res) => {
                        response.data.techniques_details[id] = { ...res.data }
                        setTechniques(Object.entries(response.data.techniques_details).map(item => item[1]));
                    }).catch((err) => console.log(err))
            })

            if (
                (response.data.effect_type === "params" || response.data.effect_type === "intensity") &&
                (!Array.isArray(response.data.assignment_stats) || (Array.isArray(response.data.assignment_stats) && response.data.assignment_stats.length === 0))
            ) {
                const assignment_stats = ["dribble", "shot", "pass", "tackle", "block", "intercept", "speed", "power", "technique", "punch", "catch", "highball", "lowball"]
                setPlayerSelected(({
                    ...initialPlayerSelected,
                    ...response.data,
                    passive_skill: formatPassiveSkill,
                    leader_skill: formatLeaderSkill,
                    hidden_abilities: formatHiddenAbilitiesSkill,
                    techniques: formatTechniques,
                    assignment_stats
                }));
            } else {
                setPlayerSelected(({
                    ...initialPlayerSelected,
                    ...response.data,
                    passive_skill: formatPassiveSkill,
                    leader_skill: formatLeaderSkill,
                    hidden_abilities: formatHiddenAbilitiesSkill,
                    techniques: formatTechniques
                }));
            }

            setPlayerStats(({ ...initialPlayerStats, ...response.data.stats }));
            setNewPlayerForm(false)
            setShowForm(true);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err
        }
    }

    async function handleDelete(id) {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/player/${id}`);
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`, data.filter(function (el) { return el._id !== id; }), false)
            alert.show('La suppression du joueur a bien été pris en compte');
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`);
            setShowForm(false);
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleUpdate() {
        const newPassiveSkill = PassiveSkill?.map(skill => skill._id);
        const newLeaderSkill = LeaderSkill?.map(skill => skill._id);
        const newHiddenAbilitiesSkill = HiddenAbilities?.map(skill => skill._id);
        const newTechniques = Techniques?.map(skill => skill._id);

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
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`);
            setShowForm(false)
            return response.data;
        } catch (err) {
            alert.show('Une erreur est survenue');
            return err;
        }
    }

    async function handleCreate() {
        const newPassiveSkill = PassiveSkill?.map(skill => skill._id);
        const newLeaderSkill = LeaderSkill?.map(skill => skill._id);
        const newHiddenAbilitiesSkill = HiddenAbilities?.map(skill => skill._id);
        const newTechniques = Techniques?.map(skill => skill._id);

        const newPlayerData = {
            ...playerSelected,
            stats: { ...playerStats },
            passive_skill: newPassiveSkill,
            leader_skill: newLeaderSkill,
            hidden_abilities: newHiddenAbilitiesSkill,
            techniques: newTechniques
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/player/`, newPlayerData);
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`, [newPlayerData, ...data], false)
            alert.show('La création de joueur a bien été prises en compte');
            mutate(`${process.env.REACT_APP_API_URL}/api/player/`);
            setShowForm(false)
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

        if (name === "collection_card") {
            newPlayerSelected = {
                ...newPlayerSelected,
                position_in_collection: data.filter(data => data.collection_card == value).length + 1,
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
        setPassiveSkill([]);
        setLeaderSkill([]);
        setHiddenAbilities([])
        setTechniques([]);
        setPlayerSelected({
            ...initialPlayerSelected
        });
        setPlayerStats({
            ...initialPlayerStats
        });
        setNewPlayerForm(true);
        setShowForm(true);
    }

    function onImageUploaded(e) {
        const newPlayerSelected = {
            ...playerSelected,
            image_url: e.info
        }
        setPlayerSelected(newPlayerSelected);
    }

    async function handleDuplicate(id) {
        let newPlayer = {};

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/player/${id}`);

            newPlayer = {
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                image_url: response.data.image_url,
                collection_card: response.data.collection_card,
                techniques: response.data.techniques,
                color: response.data.color,
                rarity: response.data.rarity,
                position_in_collection: response.data.position_in_collection,
                sub_name: response.data.sub_name,
                country: response.data.country,
                stats: response.data.stats,
                series: response.data.series,
                chest: response.data.chest,
                hidden_abilities: response.data.hidden_abilities,
                passive_skill: response.data.passive_skill,
                leader_skill: response.data.leader_skill,
                positions: response.data.positions,
            }

            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/player/`, newPlayer);
                mutate(`${process.env.REACT_APP_API_URL}/api/player/`, [newPlayer, ...data], false)
                alert.show('Vous avez duppliqué un joueur.');
                mutate(`${process.env.REACT_APP_API_URL}/api/player/`);
            } catch (err) {
                alert.show('Une erreur est survenue ici');
            }
        } catch (err) {
            alert.show('Une erreur est survenue lala');
        }

    }

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return (
        <div className="container">
            <h1>Backoffice Liste des joueurs</h1>
            <button className="button--primary button-data--create" onClick={showNewPlayerForm}>Nouveau joueur</button>
            <table className="table-data-list">
                <tbody>
                    {Array.isArray(data) && data.reverse().map((player, index) => {
                        return (
                            <tr className="table-data-list__item player-data-inline" key={index}>
                                <td width="45">
                                    <img
                                        className="player-data-inline__img"
                                        src={player?.image_url ? player?.image_url.url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                                        alt={player?.first_name + '_' + player?.last_name}
                                    />
                                </td>
                                <td width="16">
                                    {
                                        player?.country ? (
                                            <span className="player-data-inline__country">
                                                <span className={`flag flag--${player?.country && player?.country.toLowerCase()}`} />
                                            </span>
                                        ) : null
                                    }
                                </td>
                                <td>
                                    <div>
                                        <span className={`player-data-inline__fullname text-color--${player?.color}`}>
                                            {player?.first_name} {player?.last_name}
                                        </span>
                                        <span className={`player-data-inline__subname text-color--${player?.color}`}>
                                            {player?.sub_name}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <ul className='player-data-inline__positions'>
                                        {
                                            Array.isArray(orderPosition) && orderPosition.map((order) => {
                                                return (
                                                    Array.isArray(player?.positions) && (player?.positions.includes(order)) ? (
                                                        <li key={order} className={`tag-position tag-position--${order.toLowerCase()}`}>
                                                            {order}
                                                        </li>
                                                    ) : null
                                                )
                                            })
                                        }
                                    </ul>
                                </td>
                                <td>
                                    <div className="table-data-list__action">
                                        <ValidModal
                                            label="Supprimer"
                                            onConfirm={() => handleDelete(player?._id)}
                                            question={"Confirmer la suppression du joueur."}
                                        />
                                        <ValidModal
                                            label="Dupliquer"
                                            onConfirm={() => handleDuplicate(player?._id)}
                                            question={"Confirmer la duplication du joueur."}
                                        />
                                        <button className="button--secondary" onClick={() => handleGetPlayer(player?._id)}>Modifier</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Modal displayModal={showForm} handleClose={() => setShowForm(false)}>
                <div className="player-img-cloudinary">
                    <WidgetCloudinary
                        onSuccess={onImageUploaded}
                    />
                    <div className="player-img-cloudinary__wrapper-img">
                        <img
                            src={playerSelected?.image_url ? playerSelected?.image_url.url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                            alt={playerSelected?.firt_name}
                            className="player-img-cloudinary__img"
                        />
                    </div>
                </div>
                <form className="simple-form" autoComplete="off" onSubmit={handleSubmit}>
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
                                    options={form?.options}
                                    fieldClass={form?.fieldClass}
                                    readonly={form?.readonly}
                                    
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
                                    fieldClass={form?.fieldClass}
                                    readonly={form?.readonly}
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
                        keySearch="description"
                    />

                    <ApiSearchInputMultipleValue
                        apiUrl={`${process.env.REACT_APP_API_URL}/api/skill/search`}
                        label="Compétence passive"
                        handleChange={setPassiveSkill}
                        type="passive_skill"
                        value={PassiveSkill}
                        limit={1}
                        resetOnDataChange={playerSelected}
                        keySearch="description"
                    />

                    <ApiSearchInputMultipleValue
                        apiUrl={`${process.env.REACT_APP_API_URL}/api/skill/search`}
                        label="Potentiel"
                        handleChange={setHiddenAbilities}
                        type="hidden_ability"
                        value={HiddenAbilities}
                        limit={5}
                        resetOnDataChange={playerSelected}
                        keySearch="description"
                    />

                    <ApiSearchInputMultipleValue
                        apiUrl={`${process.env.REACT_APP_API_URL}/api/technique/search`}
                        label="Techniques"
                        handleChange={setTechniques}
                        value={Techniques}
                        limit={7}
                        resetOnDataChange={playerSelected}
                        keysOption={["rank", "name"]}
                        className={"select-multiple-value--techniques"}
                    />
                    <fieldset>
                        {
                            newPlayerForm ? (
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

export default PlayerList;