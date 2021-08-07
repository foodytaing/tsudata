import axios from "axios";

export { getAllPlayersApi } from "../api/player.api";

export const GET_ALL_PLAYERS = "GET_ALL_PLAYERS";

export const getAllPlayersAction = () => {
    return (dispatch) => {
        return axios
        .get(`http://localhost:5000/api/player`)
          .then((res) => {
            dispatch({ type: GET_ALL_PLAYERS, payload: res.data });
          })
          .catch((err) => console.log(err));
      };
}

