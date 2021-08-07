import { GET_ALL_PLAYERS } from "../actions/player.action";

const initialState = {};

export default function playerReducer(state = initialState, action) {
  console.log(action)

  switch (action.type) {
    case GET_ALL_PLAYERS:
        return action.payload;
    default:
        return state;
  }
}