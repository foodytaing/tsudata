import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllPlayersAction
} from "../actions/player.action";
import { 
    getPlayerApi,
    updatePlayerApi,
    deletePlayerApi
} from "../api/player.api";

const PlayerList = () => {
    const dispatch = useDispatch();

    const playerListData = useSelector((state) => state.playerReducer);

    //state
    const [playerSelected, setPlayerSelected] = useState();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(getAllPlayersAction());
    }, [dispatch]);

    async function handleEdit(id) {
        try {
            const player = await getPlayerApi(id);
            setPlayerSelected(player);
            setShowForm(true);
        } catch(err) {
            return err
        }
    }

    function handleDelete(id) {
        deletePlayerApi(id);
    }

    function handleUpdate(e) {
        e.preventDefault();
        updatePlayerApi(playerSelected);
    }

    function handleCreate() {
        
    }

    function handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const newPlayerSelected = {
            ...playerSelected,
            [name]: value
        }

        setPlayerSelected(newPlayerSelected);
    }

    return (
    <>
        <h1>Backoffice Liste des joueurs</h1>
        <button onClick={handleCreate}>Ajouter</button>
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
                        <form onSubmit={handleUpdate}>
                            <fieldset>
                                <label>_id {playerSelected?._id}</label>
                                <input type="hidden" name="id" defaultValue={playerSelected?._id} />
                            </fieldset>
                            <fieldset>
                                <label>Prénom</label>
                                <input name="first_name" onChange={e => handleInputChange(e)} value={playerSelected?.first_name} />
                            </fieldset>
                            <fieldset>
                                <label>Nom</label>
                                <input name="last_name" onChange={e => handleInputChange(e)} value={playerSelected?.last_name} />
                            </fieldset>
                            <fieldset>
                                <label>Color</label>
                                <input name="color" onChange={e => handleInputChange(e)} value={playerSelected?.color} />
                            </fieldset>
                            <fieldset>
                                <label>Titre</label>
                                <input name="sub_name" onChange={e => handleInputChange(e)} value={playerSelected?.sub_name} />
                            </fieldset>
                            <button type="submit">Mettre à jour</button>
                        </form>
                    </div>
                </>
            ) : null
        }
    </>);
};

export default PlayerList;