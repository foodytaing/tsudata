import { ADD_PLAYER_ON_PANEL } from "../actions/player.action";

const initialState = [];

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PLAYER_ON_PANEL:
      return action.payload;
    default:
      return state;
  }
}