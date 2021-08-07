import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/form/Input"
import {
    getAllPlayersAction
} from "../actions/player.action";
import { 
    getPlayerApi,
    createPlayerApi,
    updatePlayerApi,
    deletePlayerApi
} from "../api/player.api";

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
        options: [
            {label: "rouge", value: "red"},
            {label: "bleu", value: "blue"},
            {label: "vert", value: "green"}
        ]
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
        options: [
            {label: "N", value: "N"},
            {label: "SR", value: "SR"},
            {label: "SSR", value: "SSR"},
            {label: "UR", value: "UR"}
        ]
    },
    {
        label: "Collection",
        name: "collection_card",
        type: "select",
        options: [
            {label: "Inclus Ticket SSR", value: "include_ticket_SSR"},
            {label: "Exclus Ticket SSR", value: "exclude_ticket_SSR"},
            {label: "Dream Collection", value: "dream_collection"},
            {label: "Dream Fest", value: "dream_fest"},
            {label: "Joueur Limité", value: "limited_player"},
            {label: "Joueur Gratuit", value: "free_player"},
            {label: "Joueur Ultra Rare", value: "lr_player"},
            {label: "World Legend", value: "world_legend"},
            {label: "Joueur Payant", value: "paying_player"}
        ]
    },
    {
        label: "Pays",
        name: "country"
    },
    {
        label: "Equipe",
        name: "team" 
    },
    {
        label: "Série",
        name: "series"
    }
]

const playerStatsForm = [
    {
        label: "Endurance",
        name: "stamina"
    },
    {
        label: "Dribble",
        name: "dribble"
    },
    {
        label: "Tir",
        name: "shot"
    },
    {
        label: "Passe",
        name: "pass"
    },
    {
        label: "Tacle",
        name: "tackle"
    },
    {
        label: "Contre",
        name: "block"
    },
    {
        label: "Interception",
        name: "intercept"
    },
    {
        label: "Rapidité",
        name: "speed"
    },
    {
        label: "Puissance",
        name: "power"
    },
    {
        label: "Technicité",
        name: "technique"
    },
    {
        label: "Coup de poing",
        name: "punch"
    },
    {
        label: "Arrêt",
        name: "catch"
    },
    {
        label: "Ballon haut",
        name: "highBall",
        type: "select",
        options: [
            {label: "Normal", value: "1"},
            {label: "Bon", value: "1.125"},
            {label: "Très bon", value: "1.25"},
        ]
    },
    {
        label: "Ballon bas",
        name: "lowBall",
        type: "select",
        options: [
            {label: "Normal", value: "1"},
            {label: "Bon", value: "1.125"},
            {label: "Très bon", value: "1.25"},
        ]
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

const playerSkillsForm = []

const playerTechniquesForm = []

const PlayerList = () => {
    const dispatch = useDispatch();
    const playerListData = useSelector((state) => state.playerReducer);

    //state
    const [playerSelected, setPlayerSelected] = useState({});
    const [playerStats, setPlayerStats] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newPlayerForm, setNewPlayerForm] = useState(false);

    useEffect(() => {
        dispatch(getAllPlayersAction());
    }, [dispatch]);

    async function handleEdit(id) {
        try {
            const player = await getPlayerApi(id);
            setPlayerSelected(player);
            setPlayerStats(player.stats);
            setShowForm(true);
        } catch(err) {
            return err
        }
    }

    function handleDelete(id) {
        deletePlayerApi(id);
    }

    function handleUpdate() {
        const newPlayerData = {
            ...playerSelected,
            stats: { ...playerStats }
        }

        updatePlayerApi(newPlayerData);
    }

    function handleCreate() {
        console.log("handleCreate");

        const newPlayerData = {
            ...playerSelected,
            stats: { ...playerStats }
        }

        createPlayerApi(newPlayerData);
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
        setNewPlayerForm(true);
        setShowForm(true);
        setPlayerSelected({
            ...initialPlayerSelected
        });
        setPlayerStats({
            ...initialPlayerStats
        });
    }

    return (
        <>
            <h1>Backoffice Liste des joueurs</h1>
            <button onClick={showNewPlayerForm}>Nouveau joueur</button>
            <ul>
                {Array.isArray(playerListData) && playerListData.map((player, index) => {
                    return (
                        <li key={index}>
                            {player?.first_name} {player?.last_name}
                            <button onClick={() => handleEdit(player?._id)}>Modifier</button>
                            <button onClick={() => handleDelete(player?._id)}>Supprimer</button>
                        </li>
                    )
                })}
            </ul>

            {
                showForm ? (
                    <>
                        <div className="modal">
                            <form onSubmit={handleSubmit}>
                                <h2>{playerSelected?._id}</h2>
                                {
                                    playerForm.map((form, index) => {
                                        return (
                                            <Input
                                                key={index}
                                                label={form?.label}
                                                name={form?.name}
                                                type={form?.type}
                                                value={playerSelected[form?.name]}
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