import { ADD_PLAYER_ON_PANEL } from "../actions/player.action";

export default function playerReducer(state = [], action) {
  switch (action.type) {
    case ADD_PLAYER_ON_PANEL:
      return action.payload;
    default:
      return state;
  }
}