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

import WidgetCloudinary from "../components/WidgetCloudinary";

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
    "positions": []
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

    function onImageUploaded(e) {
        const newPlayerSelected = {
            ...playerSelected,
            image_url: e.info.url
        }

        setPlayerSelected(newPlayerSelected);
    }

    return (
        <>
            <h1>Backoffice Liste des joueurs</h1>
            <button onClick={showNewPlayerForm}>Nouveau joueur</button>
            <ul>
                {Array.isArray(playerListData) && playerListData.map((player, index) => {
                    return (
                        <li key={index}>
                            <img
                                src={player?.image_url ? player?.image_url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                                width="20"
                            />
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
                            <WidgetCloudinary
                                onSuccess={onImageUploaded}
                            />
                            <img
                                src={playerSelected?.image_url ? playerSelected?.image_url : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                                width="100"
                            />
                            <form autoComplete="off" onSubmit={handleSubmit}>
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