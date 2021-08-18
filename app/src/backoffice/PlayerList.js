import React, { useState, useEffect } from "react";
import Input from "../components/form/Input"
import { useAlert } from 'react-alert'
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
        readonly: "true",
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
    "rarity": "UR",
    "collection_card": "",
    "position_in_collection": "",
    "first_name": "",
    "last_name": "",
    "sub_name": "",
    "country": "",
    "series": "",
    "positions": [],
    "passive_skill": [],
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
                        setLeaderSkill([{ ...res.data }])
                        setFetchLeaderSkill(true)
                    }).catch((err) => console.log(err))
            })
        }
        if (!fetchPassiveSkill) {
            playerSelected?.passive_skill?.forEach(el => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${el._id}`)
                    .then((res) => {
                        setPassiveSkill([{ ...res.data }])
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
    }, [playerSelected, fetchTechniques, fetchHiddenAbilities, fetchPassiveSkill, fetchLeaderSkill])

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
            const formatPassiveSkill = response.data.passive_skill.map(skill => { return { "_id": skill } });
            const formatLeaderSkill = response.data.leader_skill.map(skill => { return { "_id": skill } });
            const formatHiddenAbilitiesSkill = response.data.hidden_abilities.map(skill => { return { "_id": skill } });
            const formatTechniques = response.data.techniques.map(technique => { return { "_id": technique } });

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
                                        src={player?.image_url ? player?.image_url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
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
                            src={playerSelected?.image_url ? playerSelected?.image_url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
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