import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlayersAction } from "../actions/player.action";

const PlayerList = () => {
    const dispatch = useDispatch();
    const playerListData = useSelector((state) => state.playerReducer);

    useEffect(() => {
        dispatch(getAllPlayersAction());
    }, [dispatch]);

    return (
    <>
        <h1>Liste des joueurs</h1>
        {Array.isArray(playerListData) && playerListData.map((player, index) => {
            return (
                <div key={index}>{player?.first_name} {player?.last_name}</div>
            )
        })}
    </>);
};

export default PlayerList;