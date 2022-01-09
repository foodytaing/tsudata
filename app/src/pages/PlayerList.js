import React, { useState } from "react";
import { useAlert } from 'react-alert'
import useSWR from 'swr'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ADD_PLAYER_ON_PANEL } from "../actions/player.action"
import ComparePanel from "../components/ComparePanel";
import FilterPlayer from "../components/FilterPlayer";

import FontAwesome from 'react-fontawesome'

import logo from "../img/tsudata-logo.png"
import playersPossessedData from '../data/players_possessed.json'

import './playerlist.scss';

export const creatKeyId = (id) => {
    return id + "_" + Math.floor(Math.random() * Math.floor(999999));
};

const initialFilter = {}

const orderPosition = ['at', 'mo', 'md', 'df', 'gb'];
const fetcher = url => fetch(url).then(r => r.json())

const PlayerList = () => {
    const alert = useAlert()
    const dispatch = useDispatch();
    const playersOnPanel = useSelector((state) => state.playerReducer);

    const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/player/`, fetcher)

    const [playersPossessed, setPlayersPossessed] = useState([...playersPossessedData]);
    const [filter, setFilter] = useState({ ...initialFilter });

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    let dataFiltered = data.filter(data => {
        return Object.keys(filter).every(f => {
            if (f === "first_name") {
                return filter[f].toLowerCase() === data[f].toLowerCase()
            } else {
                return filter[f] === data[f]
            }
        });
    });

    const allPlayers = [
        {
            category: "Next Dream",
            data: dataFiltered.filter(data => data.collection_card === "next_dream")
        },
        {
            category: "Joueurs SSR",
            data: dataFiltered.filter(data => data.collection_card === "include_ticket_SSR").concat(dataFiltered.filter(data => data.collection_card == "lr_player"))
        },
        {
            category: "Joueurs Type/Continent",
            data: dataFiltered.filter(data => data.collection_card === "exclude_ticket_SSR")
        },
        {
            category: "Dream Collection",
            data: dataFiltered.filter(data => data.collection_card === "dream_collection")
        },
        {
            category: "Dream Festival",
            data: dataFiltered.filter(data => data.collection_card === "dream_festival")
        },
        {
            category: "Joueurs Limités",
            data: dataFiltered.filter(data => data.collection_card === "limited_player")
        },
        {
            category: "Joueurs Gratuits",
            data: dataFiltered.filter(data => data.collection_card === "free_player")
        },
        {
            category: "Joueurs Payants",
            data: dataFiltered.filter(data => data.collection_card === "paying_player")
        },
        {
            category: "World Legend",
            data: dataFiltered.filter(data => data.collection_card === "world_legend")
        }
    ]

    async function handleAddPlayerOnPanel(id) {
        if (Array.isArray(playersOnPanel) & playersOnPanel.length === 5) {
            alert.show('Vous avez atteint le nombre maximal de joueur dans la liste de comparaison.');
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/player/${id}`);

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
                    }).catch((err) => console.log(err))
            })

            response.data?.passive_skill?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${id}`)
                    .then((res) => {
                        response.data.passive_skill_details[id] = { ...res.data }
                    }).catch((err) => console.log(err))
            })

            response.data?.hidden_abilities?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/skill/${id}`)
                    .then((res) => {
                        response.data.hidden_abilities_details[id] = { ...res.data }
                    }).catch((err) => console.log(err))
            })

            response.data?.techniques?.forEach(id => {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/api/technique/${id}`)
                    .then((res) => {
                        response.data.techniques_details[id] = { ...res.data }
                    }).catch((err) => console.log(err))
            })

            const newPlayersOnPanel = [...playersOnPanel, { ...response.data, keyId: creatKeyId(response.data._id) }]

            dispatch({ type: ADD_PLAYER_ON_PANEL, payload: newPlayersOnPanel });

            alert.show('Le joueur à été ajouté dans la liste de comparaison.');

        } catch (err) {
            alert.show('Une erreur est survenue');
            return err
        }
    }

    function deletePlayerOnPanel(index) {
        const newPlayersOnPanel = [
            ...playersOnPanel.slice(0, index),
            ...playersOnPanel.slice(index + 1, playersOnPanel.length),
        ];

        dispatch({ type: ADD_PLAYER_ON_PANEL, payload: newPlayersOnPanel });
    }

    function clearPlayerOnPanel() {
        dispatch({ type: ADD_PLAYER_ON_PANEL, payload: [] });
    };

    function addPlayer(id) {
        if (Array.isArray(playersPossessed) && playersPossessed.includes(id)) {
            let newPlayersPossessed = [...playersPossessed];
            let index = newPlayersPossessed.indexOf(id);
            newPlayersPossessed.splice(index, 1)
            setPlayersPossessed(newPlayersPossessed);
        } else {
            const newPlayersPossessed = [...playersPossessed, id]
            setPlayersPossessed(newPlayersPossessed);
        }
    }

    return (
        <>
            <div className="container">
                <header>
                    <img src={logo} alt="tsudata" className="logo-tsudata" />
                </header>
                <FilterPlayer
                    handleFilterChange={setFilter}
                />
                {Array.isArray(allPlayers) && allPlayers.map((players) => {
                    if (players.data.length) {
                        return (
                            <div key={players.category}>
                                <h2>{players.category}</h2>
                                <div className="player-list">
                                    {players.data.map(player => {
                                        return (
                                            <div onClick={() => handleAddPlayerOnPanel(player._id)} key={player._id} className={`player-list__item player-list__item--${player.color} ${Array.isArray(playersPossessed) && playersPossessed.includes(player._id) ? "player-list__item--possessed" : ""}`}>
                                                <div className="player-list__wrapper-img">
                                                    <img
                                                        className="player-list__img"
                                                        src={player?.image_url ? `https://res.cloudinary.com/dcty4rvff/image/upload/c_scale,h_75/${player?.image_url.path}` : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                                                        alt={player?.first_name + '_' + player?.last_name}
                                                    />
                                                </div>
                                                {
                                                    player.chest === "true" ? (
                                                        <span className="badge-free player-list__gift">
                                                            <FontAwesome
                                                                name="gift"
                                                            />
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            <ComparePanel
                players={playersOnPanel}
                handleClearPlayerOnPanel={clearPlayerOnPanel}
                handleDeletePlayerOnPanel={deletePlayerOnPanel}
            />
        </>
    );
};

export default PlayerList;