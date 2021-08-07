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
        name: "country",
        type: "select",
        options: [
            {label: "Japon", value: "japan"},
            {label: "Allemagne", value: "germany"},
            {label: "France", value: "france"},
            {label: "Italie", value: "italia"},
            {label: "Hollande", value: "netherlands"},
            {label: "Angleterre", value: "england"},
            {label: "Suède", value: "sweden"},
            {label: "Espagne", value: "spain"},
            {label: "Mexique", value: "mexico"},
            {label: "Brésil", value: "brazil"},
            {label: "Argentine", value: "argentina"},
            {label: "Uruguay", value: "uruguay"},
            {label: "Thaïlande", value: "thailand"},
            {label: "Arabie Saoudite", value: "saudi_arabia"},
            {label: "Ouzbékistan", value: "uzbekistan"},
            {label: "Chine", value: "china"},
            {label: "Corée du Sud", value: "korea"},
            {label: "Nigéria", value: "nigeria"},
            {label: "Portugal", value: "portugal"},
            {label: "Danemark", value: "danmark"},
        ]
    },
    {
        label: "Equipe",
        name: "team" ,
        type: "select",
        options: [
            {label: "Japon", value: "Japon"},
            {label: "Allemagne", value: "Allemagne"},
            {label: "France", value: "France"},
            {label: "Italie", value: "Italie"},
            {label: "Hollande", value: "Hollande"},
            {label: "Angleterre", value: "Angleterre"},
            {label: "Suède", value: "Suède"},
            {label: "Espagne", value: "Espagne"},
            {label: "Mexique", value: "Mexique"},
            {label: "Brésil", value: "Brésil"},
            {label: "Argentine", value: "Argentine"},
            {label: "Uruguay", value: "Uruguay"},
            {label: "Thaïlande", value: "Thaïlande"},
            {label: "Arabie Saoudite", value: "Arabie Saoudite"},
            {label: "Ouzbékistan", value: "Ouzbékistan"},
            {label: "Chine", value: "Chine"},
            {label: "Corée du Sud", value: "Corée du Sud"},
            {label: "Nigéria", value: "Nigéria"},
            {label: "Portugal", value: "Portugal"},
            {label: "Danemark", value: "Danemark"},
        ]
    },
    {
        label: "Série",
        name: "series",
        type: "select",
        options: [
            {label: "Collégien", value: "Collégien"},
            {label: "Lycée", value: "Lycée"},
            {label: "Junior", value: "Junior"},
            {label: "Qualification zone Asie", value: "Qualification zone Asie"},
            {label: "Mondial Espoir", value: "Mondial Espoir"},
            {label: "Real Japan 7", value: "Real Japan 7"},
            {label: "Golden 23", value: "Golden 23"},
            {label: "Rising Sun", value: "Rising Sun"},
            {label: "Clubs européens", value: "Clubs européens"},
            {label: "Club sud-américains", value: "Club sud-américains"},
            {label: "Club Japonais", value: "Club Japonais"}
        ]
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